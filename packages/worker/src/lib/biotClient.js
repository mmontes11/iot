import rest from "restler";
import httpStatus from "http-status";
import _ from "underscore";
import storage from "./storage";
import log from "../utils/log";

const tokenKey = "token";
const { BIOT_URL, BACK_BASIC_AUTH_USER, BACK_BASIC_AUTH_PASSWORD, BIOT_USER, BIOT_PASSWORD } = process.env;

class TokenHandler {
  static getTokenFromStorage() {
    return storage.getItemSync(tokenKey);
  }
  static storeToken(token) {
    storage.setItemSync(tokenKey, token);
  }
  static invalidateToken() {
    storage.clearSync();
  }
}

class RequestError {
  constructor(statusCode, headers, body) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
  }
}

class PostRequest {
  constructor(url, options, data) {
    this.id = new Date().getTime();
    this.method = "POST";
    this.url = url;
    this.options = Object.assign({}, PostRequest._headersOptions(), options);
    this.data = data;
  }
  start() {
    const request = rest.postJson(this.url, this.data, this.options);
    const requestId = this.id;
    log.logRequest(request, requestId);
    return new Promise((resolve, reject) => {
      request
        .on("success", (data, response) => {
          log.logInfo(`Request ${requestId} succeeded`);
          log.logResponse(data, response, requestId);
          resolve({
            statusCode: response.statusCode,
            headers: response.headers,
            body: data,
          });
        })
        .on("fail", (data, response) => {
          log.logInfo(`Request ${requestId} failed`);
          log.logResponse(data, response, requestId);
          if (_.isEqual(response.statusCode, httpStatus.UNAUTHORIZED)) {
            TokenHandler.invalidateToken();
          }
          reject(new RequestError(response.statusCode, response.headers, data));
        })
        .on("error", err => {
          log.logError(`Request ${requestId} errored`);
          reject(err);
        })
        .on("abort", () => {
          log.logInfo(`Request ${requestId} aborted`);
          reject();
        })
        .on("timeout", () => {
          log.logError(`Request ${requestId} timeout`);
          reject();
        });
    });
  }
  static _headersOptions() {
    return {
      headers: {
        Accept: "application/json",
        "User-Agent": "IoT Worker",
      },
    };
  }
}

class BiotClient {
  constructor(url, basicAuthUsername, basicAuthPassword, username, password) {
    this.url = url;
    this.basicAuthUsername = basicAuthUsername;
    this.basicAuthPassword = basicAuthPassword;
    this.username = username;
    this.password = password;
  }
  sendEventNotifications(notifications) {
    return this._sendNotifications("event/notifications", notifications);
  }
  sendMeasurementNotifications(notifications) {
    return this._sendNotifications("measurement/notifications", notifications);
  }
  sendMeasurementChangeNotifications(notifications) {
    return this._sendNotifications("measurementChange/notifications", notifications);
  }
  async _sendNotifications(path, notifications = []) {
    try {
      const postRequest = await this._postWithAccessToken(path, { notifications });
      return postRequest.start();
    } catch (err) {
      throw err;
    }
  }
  async _postWithAccessToken(path, data) {
    let accessToken;
    try {
      accessToken = await this._getToken();
    } catch (err) {
      throw err;
    }
    const url = `${this.url}/${path}`;
    const options = {
      accessToken,
    };
    return new PostRequest(url, options, data);
  }
  _postWithBasicAuthCredentials(path, data) {
    const url = `${this.url}/${path}`;
    const basicAuthOptions = {
      username: this.basicAuthUsername,
      password: this.basicAuthPassword,
    };
    return new PostRequest(url, basicAuthOptions, data);
  }
  async _getToken() {
    const tokenFromStorage = TokenHandler.getTokenFromStorage();
    if (_.isUndefined(tokenFromStorage)) {
      try {
        const credentials = {
          username: this.username,
          password: this.password,
        };
        const authRequest = this._postWithBasicAuthCredentials("auth/token", credentials);
        const res = await authRequest.start();
        const {
          body: { token },
        } = res;
        TokenHandler.storeToken(token);
        return token;
      } catch (err) {
        TokenHandler.invalidateToken();
        throw err;
      }
    } else {
      return tokenFromStorage;
    }
  }
}

const biotClient = new BiotClient(BIOT_URL, BACK_BASIC_AUTH_USER, BACK_BASIC_AUTH_PASSWORD, BIOT_USER, BIOT_PASSWORD);

export default biotClient;
