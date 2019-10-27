import _ from "underscore";
import fetch from "cross-fetch";
import queryString from "query-string";
import { UNAUTHORIZED } from "http-status";

export class Service {
  constructor(client, resource) {
    this.client = client;
    this.baseUrl = `${this.client.url}/${resource}`;
  }
  async get(path, options = {}) {
    const url = this._getUrl(path, options);
    const headers = await this._getHeaders(options);
    const fetchOptions = {
      method: "GET",
      headers,
    };
    return this._request(url, fetchOptions);
  }
  async post(path, data, options = {}) {
    const url = this._getUrl(path, options);
    const body = JSON.stringify(data);
    const extraHeaders = {
      "Content-Type": "application/json",
    };
    const headers = await this._getHeaders(options, extraHeaders);
    const fetchOptions = {
      method: "POST",
      body,
      headers,
    };
    return this._request(url, fetchOptions);
  }
  async delete(path, options = {}) {
    const url = this._getUrl(path, options);
    const headers = await this._getHeaders(options);
    const fetchOptions = {
      method: "DELETE",
      headers,
    };
    return this._request(url, fetchOptions);
  }
  _getUrl(path, options) {
    const { query } = options;
    let baseUrl = !_.isUndefined(path) ? `${this.baseUrl}/${path}` : this.baseUrl;
    const addQuery = !_.isUndefined(query) && _.some(Object.values(query), q => !_.isUndefined(q));
    if (addQuery) {
      baseUrl = `${baseUrl}?${queryString.stringify(query)}`;
    }
    return baseUrl;
  }
  async _getAuthHeader(options) {
    const { auth = false, basicAuth = false } = options;
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
  async _getHeaders(options, extraHeaders = {}) {
    let headers = {
      Accept: "application/json",
      ...extraHeaders,
    };
    const auth = await this._getAuthHeader(options);
    if (auth) {
      headers = {
        ...headers,
        ...auth,
      };
    }
    return headers;
  }
  async _request(url, options) {
    const { log } = this.client;
    const requestId = this._getRequestId();
    log.logRequest(requestId, url, options);
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url, options);
        const { status: statusCode, statusText } = res;
        const status = `${statusCode} ${statusText}`;
        const body = await res
          .clone()
          .json()
          .catch(() => res.text());
        const result = { statusCode, statusText, body };
        if (statusCode >= 400) {
          if (statusCode === UNAUTHORIZED) {
            this.client.authService.logout();
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
