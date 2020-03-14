import _ from "underscore";
import fetch from "cross-fetch";
import queryString from "query-string";
import { UNAUTHORIZED } from "http-status";

export class Service {
  constructor(client, resource) {
    this.client = client;
    this.baseUrl = `${this.client.url}/${resource}`;
  }
  async get(path, reqOpts = {}) {
    const url = this._getUrl(path, reqOpts);
    const headers = await this._getHeaders(reqOpts);
    const fetchOpts = {
      method: "GET",
      headers,
    };
    return this._request(url, fetchOpts, reqOpts);
  }
  async post(path, data, reqOpts = {}) {
    const url = this._getUrl(path, reqOpts);
    const body = JSON.stringify(data);
    const extraHeaders = {
      "Content-Type": "application/json",
    };
    const headers = await this._getHeaders(reqOpts, extraHeaders);
    const fetchOpts = {
      method: "POST",
      body,
      headers,
    };
    return this._request(url, fetchOpts, reqOpts);
  }
  async delete(path, reqOpts = {}) {
    const url = this._getUrl(path, reqOpts);
    const headers = await this._getHeaders(reqOpts);
    const fetchOptions = {
      method: "DELETE",
      headers,
    };
    return this._request(url, fetchOptions, reqOpts);
  }
  _getUrl(path, opts) {
    const { query } = opts;
    let baseUrl = !_.isUndefined(path) ? `${this.baseUrl}/${path}` : this.baseUrl;
    const addQuery = !_.isUndefined(query) && _.some(Object.values(query), q => !_.isUndefined(q));
    if (addQuery) {
      baseUrl = `${baseUrl}?${queryString.stringify(query)}`;
    }
    return baseUrl;
  }
  async _getAuthHeader(opts) {
    const { auth = false, basicAuth = false } = opts;
    if (auth) {
      const token = await this.client.authService.getToken();
      return { Authorization: `Bearer ${token}` };
    }
    if (basicAuth) {
      const token = this.client.authService.getBasicAuthToken();
      return { Authorization: `Basic ${token}` };
    }
    return null;
  }
  async _getHeaders(opts, extraHeaders = {}) {
    let headers = {
      Accept: "application/json",
      ...extraHeaders,
    };

    const auth = await this._getAuthHeader(opts);
    if (auth) {
      headers = {
        ...headers,
        ...auth,
      };
    }
    return headers;
  }
  async _refreshOpts(fetchOpts, reqOpts) {
    await this.client.authService.refreshToken();
    const headers = await this._getHeaders(reqOpts);
    return {
      ...fetchOpts,
      headers,
    };
  }
  async _performFetch(url, fetchOpts) {
    const res = await fetch(url, fetchOpts);
    const { status: statusCode, statusText } = res;
    const status = `${statusCode} ${statusText}`;
    const body = await res
      .clone()
      .json()
      .catch(() => res.text());
    return { statusCode, status, body };
  }
  async _request(url, fetchOpts, reqOpts) {
    const {
      log,
      handleExpiredToken,
      authService: { logout },
    } = this.client;
    const requestId = this._getRequestId();
    log.logRequest(requestId, url, fetchOpts);
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this._performFetch(url, fetchOpts);
        if (result.statusCode === UNAUTHORIZED) {
          if (handleExpiredToken) {
            handleExpiredToken();
            reject(result);
            return;
          }
          const newOpts = await this._refreshOpts(fetchOpts, reqOpts);
          result = await this._performFetch(url, newOpts);
        }
        const { statusCode, status, body } = result;
        if (statusCode >= 400) {
          if (statusCode === UNAUTHORIZED) {
            await logout();
          }
          log.logInfo(`Request ${requestId} errored`);
          log.logResponse(requestId, status, body);
          reject(result);
        } else {
          log.logInfo(`Request ${requestId} succedeed`);
          log.logResponse(requestId, status, body);
          resolve(result);
        }
      } catch (err) {
        log.logInfo(`Request ${requestId} failed`);
        log.logError(err);
        reject(err);
      }
    });
  }
  _getRequestId() {
    return new Date().getTime();
  }
}
