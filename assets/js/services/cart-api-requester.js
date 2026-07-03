// カートAPI（eXs方式）。init ベースの基底を継承。
import { ApiRequester } from './base-api-requester.js';

export class CartApiRequester extends ApiRequester {
  // カート取得
  static async fetchCart(body = {}) {
    return (await this.performAction('cart', 'POST', body, { isNotSendErrors: true })).json;
  }
  // カート投入（{ items:[{id, quantity, site}] }）
  static async addItemsToCart(body) {
    return (await this.performAction('cart/details', 'PUT', body)).json;
  }
  // 明細削除
  static async deleteCartDetails(body) {
    return (await this.performAction('cart/details/delete', 'POST', body)).json;
  }
  // 数量変更
  static async changeCartDetailQuantity(body) {
    return (await this.performAction('cart/details/quantity', 'PUT', body)).json;
  }
}
