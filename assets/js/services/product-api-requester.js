// 商品API（eXs方式）。init ベースの基底を継承。
import { ApiRequester } from './base-api-requester.js';

const BMA_API_BASE_URL = 'https://api-f.customjapan.net/api/v1';

export class ProductApiRequester extends ApiRequester {
  // 指定IDの商品情報を取得（価格・在庫・fit 等）
  static async fetchItems(ids) {
    const normalized = (Array.isArray(ids) ? ids : [ids]).map((x) => String(x || '').trim()).filter(Boolean);
    if (!normalized.length) throw new Error('items: no ids');
    const json = (await this.performAction('items', 'POST', { ids: normalized })).json;
    if (json?.result === 'error' || (Array.isArray(json?.errors) && json.errors.length)) {
      const e = json?.errors?.[0] || {};
      throw new Error(`items: ${e.cd || ''} ${e.abstract || 'API request failed'}`.trim());
    }
    return json;
  }

  // BMA API（api-f）から画像情報（img / imgs / freeImgs）を取得。init 不要・軽量。
  static async fetchItemBmaInfo(id) {
    const base = (typeof window !== 'undefined' && window.ASMAX_API_CONFIG?.bmaApiBaseUrl) || BMA_API_BASE_URL;
    const res = await fetch(`${base}/getItemBmaInfo?id=${encodeURIComponent(id)}`, {
      method: 'GET', credentials: 'include',
    });
    if (!res.ok) return null;
    return res.json();
  }
}
