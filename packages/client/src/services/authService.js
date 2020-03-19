import _ from "underscore";
import { Service } from "./service";
import { TokenHandler } from "../helpers/tokenHandler";
import { getBasicAuthHeader } from "../helpers/auth";

export class AuthService extends Service {
  constructor(client) {
    super(client, "auth");
  }
  checkAuth(credentials) {
    return this.post(undefined, credentials);
  }
  checkAuthToken(token) {
    return this.post(undefined, { token });
  }
  createUser(user) {
    const options = { basicAuth: true };
    return this.post("user", user, options);
  }
  async getToken() {
    const tokenFromStorage = await TokenHandler.getToken();
    if (tokenFromStorage) {
      return tokenFromStorage;
    }
    try {
      const {
        body: { token },
      } = await this._getToken();
      await TokenHandler.storeToken(token);
      return token;
    } catch (err) {
      await TokenHandler.invalidateToken();
      throw err;
    }
  }
  getBasicAuthToken() {
    if (_.isUndefined(this.client.basicAuthCredentials)) {
      throw new Error("Basic auth credentials required");
    }
    const { username, password } = this.client.basicAuthCredentials;
    return getBasicAuthHeader(username, password);
  }
  setCredentials(username, password) {
    this.client.userCredentials = { username, password };
  }
  logout() {
    return TokenHandler.invalidateToken();
  }
  async refreshToken() {
    await this.logout();
    await this.getToken();
  }
  _getToken() {
    if (_.isUndefined(this.client.userCredentials)) {
      throw new Error("User credentials required");
    }
    const user = this.client.userCredentials;
    const reqOpts = {
      auth: false,
      basicAuth: false,
      retryOnUnauthorized: false,
    };
    return this.post("token", user, reqOpts);
  }
}
