import { ApiRequester } from './services/base-api-requester.js';
import { AuthApiRequester } from './services/auth-api-requester.js';
import { CartApiRequester } from './services/cart-api-requester.js';

const API_BASE_URL = 'https://api-e.customjapan.net/api/v1';

export const initApiClient = (apiBaseUrl = API_BASE_URL) => {
    ApiRequester.setApiBaseUrl(apiBaseUrl);
};

export const verifyLogin = async () => {
    const res = await AuthApiRequester.verifyLogin();
    return res;
};

export const fetchCart = async () => {
    const res = await CartApiRequester.fetchCart();
    return res?.data || res;
};

export const addItemsToCart = async (items) => {
    const normalizedItems = (Array.isArray(items) ? items : [])
        .map((item) => ({
            id: item?.id,
            quantity: Number(item?.quantity || 1),
            site: item?.site || 'asmax'
        }))
        .filter((item) => item.id);

    if (normalizedItems.length === 0) {
        throw new Error('No cart items to add');
    }

    const res = await CartApiRequester.addItemsToCart({
        items: normalizedItems
    });
    return res;
};

export const addItemToCart = async (id, quantity) => {
    return addItemsToCart([
        {
            id,
            quantity
        }
    ]);
};

export const deleteCartItem = async (cartDetails) => {
    const req = (Array.isArray(cartDetails) ? cartDetails : []).map((detail) => ({ ...detail }));
    const res = await CartApiRequester.deleteCartDetails(req);
    return res;
};

export const clearCart = async () => {
    const cart = await fetchCart();
    if (!cart || !cart.details || cart.details.length === 0) return;
    const req = cart.details;
    const res = await CartApiRequester.deleteCartDetails(req);
    return res;
};

export const getApiRequestHeaders = () => {
    const headers = {
        Accept: 'application/json'
    };
    const xGuid = ApiRequester.getXGuid();
    const authorization = ApiRequester.getAuthorization();
    if (xGuid) headers['X-Guid'] = xGuid;
    if (authorization) headers.Authorization = authorization;
    return headers;
};
