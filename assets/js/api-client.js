// ASMAX JAPAN × Custom Japan — APIクライアント(eXs方式準拠 / SPconnect実装を移植)
// init(api-i)→ Cookie確立 → api-e で cart/items。site は 'asmax'。
import { ApiRequester } from './services/base-api-requester.js';
import { CartApiRequester } from './services/cart-api-requester.js';
import { ProductApiRequester } from './services/product-api-requester.js';

const API_BASE_URL = 'https://api-e.customjapan.net/api/v1';
const INIT_API_BASE_URL = 'https://api-i.customjapan.net/api/v1';
export const SITE = 'asmax';

export const initApiClient = (cfg = {}) => {
  // 旧シグネチャ(initApiClient('https://…'))にも互換対応
  if (typeof cfg === 'string') cfg = { apiBaseUrl: cfg };
  ApiRequester.setApiBaseUrl(cfg.apiBaseUrl || API_BASE_URL);
  ApiRequester.setInitApiBaseUrl(cfg.initApiBaseUrl || INIT_API_BASE_URL);
  ApiRequester.setSiteHeader(cfg.xSite || 'ec');
};

// 認証初期化(guid / authorization / cid Cookie 発行)
export const init = () => ApiRequester.init();

export const fetchCart = async () => {
  const res = await CartApiRequester.fetchCart();
  return res?.data || res;
};

export const addItemsToCart = async (items) => {
  const normalized = (Array.isArray(items) ? items : [])
    .map((i) => ({ id: i?.id, quantity: Number(i?.quantity || 1), site: i?.site || SITE }))
    .filter((i) => i.id);
  if (!normalized.length) throw new Error('No cart items to add');
  return CartApiRequester.addItemsToCart({ items: normalized });
};

export const addItemToCart = (id, quantity = 1) => addItemsToCart([{ id, quantity }]);

export const deleteCartItem = (cartDetails) =>
  CartApiRequester.deleteCartDetails((Array.isArray(cartDetails) ? cartDetails : [cartDetails]).map((d) => ({ ...d })));

export const changeQuantity = (body) => CartApiRequester.changeCartDetailQuantity(body);

// 商品情報(価格・在庫等)。カラーごとに商品IDが異なるため、必ずSKU単位のIDで照会する。
export const fetchItems = (ids) => ProductApiRequester.fetchItems(ids);
export const fetchItemBmaInfo = (id) => ProductApiRequester.fetchItemBmaInfo(id);

// APIレスポンス → {id, price, inStock, status} に正規化(SPconnect live-item-data と同ロジック)
export const normalizeLiveItem = (item) => {
  const toNum = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };
  const price = toNum(
    item?.price?.regular?.pc?.taxIn ??
    item?.price?.regular?.taxIn ??
    item?.price?.taxIn ??
    item?.price?.list?.taxIn
  );
  const statusCd = item?.status?.cd || '';
  const rawStatus = item?.status?.txt || '';
  const icons = Array.isArray(item?.icons) ? item.icons : [];
  const iconText = icons.map((ic) => `${ic?.cd || ''} ${ic?.txt || ''}`).join(' ');
  const inStock = !item?.isNotForSale && (
    statusCd === 'SE' ||
    /在庫あり|即納/.test(rawStatus) ||
    /\bINS\b|即納/.test(iconText)
  );
  return {
    id: String(item?.id || ''),
    price,
    status: String(rawStatus).replace(/[◯○◎△×]/g, '').trim(),
    inStock,
    isNotForSale: Boolean(item?.isNotForSale),
  };
};

// カート内点数(バッジ用)。失敗時は null。
export const cartCount = async () => {
  try {
    const cart = await fetchCart();
    const details = cart?.details || [];
    return details.reduce((s, d) => s + (Number(d.quantity) || 0), 0);
  } catch {
    return null;
  }
};
