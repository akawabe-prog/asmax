// ASMAX JAPAN × Custom Japan — 基底APIリクエスター（init ベース / eXs方式準拠）
// 認証は api-i の /init で確立（guid / authorization / cid を Cookie に発行）。
// 各リクエストは credentials:'include' で Cookie を送る。401/403 は init し直して1回だけ再試行。
// ※ ドメイン (本番ドメイン) は customjapan.net のサブドメインのため、
//    .customjapan.net 上の Cookie が api-*.customjapan.net へ送られる前提。
//    （本番では API 側の CORS 許可オリジンに (本番ドメイン) を含める必要あり）

const BASE_TIMER = 0;        // 0 = タイムアウト無し
const INIT_TIMER = 15000;    // init は15秒
const DEFAULT_SITE_HEADER = 'ec';
const timeoutSignal = (ms) =>
  ms && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(ms)
    : undefined;

export class ApiRequester {
  static instance = null;
  static apiBaseUrl = '';      // 本体EC（api-e）
  static initApiBaseUrl = '';  // 認証初期化（api-i）
  static siteHeader = DEFAULT_SITE_HEADER;
  static activeRequestCount = 0;
  static initializationPromise = null;
  static initData = null;

  _errors = [];
  _infos = [];
  _requestInProgress = false;

  constructor() {
    if (!ApiRequester.apiBaseUrl) throw new Error('API_BASE_URL is not set');
  }

  static setApiBaseUrl(url) { ApiRequester.apiBaseUrl = url; }
  static setInitApiBaseUrl(url) { ApiRequester.initApiBaseUrl = url; }
  static setSiteHeader(value) { ApiRequester.siteHeader = value || DEFAULT_SITE_HEADER; }
  static getInitData() { return ApiRequester.initData || {}; }
  static shouldHidePrices() {
    const data = ApiRequester.getInitData();
    return data?.isBiz === true && data?.isLoggedIn === false;
  }

  getCookie(name) {
    if (typeof document === 'undefined') return null;
    const key = `${encodeURIComponent(name)}=`;
    const found = (document.cookie ? document.cookie.split('; ') : []).find((c) => c.startsWith(key));
    return found ? decodeURIComponent(found.slice(key.length)) : null;
  }

  // init（api-i）で認証 Cookie を確立。ensureInitialized から自己再帰しないよう直接 fetch。
  static async init() {
    if (!ApiRequester.initApiBaseUrl) throw new Error('initApiBaseUrl が未設定です');
    const res = await fetch(`${ApiRequester.initApiBaseUrl}/init`, {
      method: 'GET',
      headers: { 'x-site': ApiRequester.siteHeader },
      credentials: 'include',
      signal: timeoutSignal(INIT_TIMER),
    });
    if (!res.ok) throw new Error(`init failed: ${res.status}`);
    const json = await res.json().catch(() => ({}));
    if (json?.result === 'error' || (Array.isArray(json?.errors) && json.errors.length)) {
      const e = json?.errors?.[0] || {};
      throw new Error(`init failed: ${e.cd || ''} ${e.abstract || 'API request failed'}`.trim());
    }
    ApiRequester.initData = json?.data || {};
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asmax:init', { detail: ApiRequester.initData }));
    }
    return json;
  }

  // guid Cookie が無い時だけ init を実行（毎回は叩かない）。並行リクエストでは Promise を共有。
  async ensureInitialized() {
    if (this.getCookie('guid')) return;
    if (!ApiRequester.initializationPromise) {
      ApiRequester.initializationPromise = ApiRequester.init().catch((e) => {
        ApiRequester.initializationPromise = null;
        throw e;
      });
    }
    await ApiRequester.initializationPromise;
    ApiRequester.initializationPromise = null;
  }

  isSafari() {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    const iOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    return iOS || /^((?!chrome|android|crios|fxios|edg|opr).)*safari/i.test(ua);
  }

  get errors() { return this._errors; }
  get infos() { return this._infos; }
  get errorMessages() { return this._errors.map((e) => (e.cd !== 'ITM9001' ? e.abstract ?? '' : '')).filter(Boolean); }
  get requestInProgress() { return this._requestInProgress; }

  static updateRequestInProgress() {
    ApiRequester.getInstance()._requestInProgress = ApiRequester.activeRequestCount > 0;
  }

  async sendRequest(path, method = 'GET', body = null, options = {}, _retried = false) {
    this._errors = []; this._infos = [];
    const { overrideApiBaseUrl, isFileResponse = false, timer = BASE_TIMER, isNotSendErrors = false } = options || {};
    try {
      await this.ensureInitialized();
      const base = overrideApiBaseUrl || ApiRequester.apiBaseUrl;
      const headers = {
        'x-site': ApiRequester.siteHeader,
        ...(body !== null ? { 'Content-Type': 'application/json' } : {}),
      };
      const res = await fetch(`${base}/${path}`, {
        method, headers,
        credentials: 'include',
        ...(this.isSafari() ? { cache: 'no-store' } : {}),
        body: body !== null ? JSON.stringify(body) : undefined,
        signal: timeoutSignal(timer),
      });
      const status = res.status;
      // 認証切れは init し直して1回だけ再試行
      if ((status === 401 || status === 403) && !_retried) {
        ApiRequester.initializationPromise = null;
        await ApiRequester.init().catch(() => {});
        return this.sendRequest(path, method, body, options, true);
      }
      if (status === 404 || status === 403 || status === 500 || status === 503) throw status;
      const json = isFileResponse ? await res.blob() : await res.json();
      if (!isFileResponse && Array.isArray(json?.errors)) this._errors = json.errors;
      if (!isFileResponse && Array.isArray(json?.infos)) this._infos = json.infos;
      return { json, resHeaders: res.headers };
    } catch (error) {
      if (isNotSendErrors) {
        this._errors = [{ abstract: 'APIリクエストが失敗しました', cd: '', level: '4' }];
        console.error('API request failed:', error, path);
        return { json: { result: 'error', errors: this._errors }, resHeaders: undefined };
      }
      console.error('API error:', error);
      throw error;
    }
  }

  static getInstance() {
    if (!ApiRequester.instance) ApiRequester.instance = new ApiRequester();
    return ApiRequester.instance;
  }

  static changeProgressStatus(isLoading) {
    ApiRequester.activeRequestCount = isLoading ? 1 : 0;
    ApiRequester.updateRequestInProgress();
  }

  static async performAction(path, method, body, options) {
    const instance = ApiRequester.getInstance();
    try {
      ApiRequester.activeRequestCount++;
      ApiRequester.updateRequestInProgress();
      return await instance.sendRequest(path, method, body, options);
    } finally {
      ApiRequester.activeRequestCount--;
      ApiRequester.updateRequestInProgress();
    }
  }
}
