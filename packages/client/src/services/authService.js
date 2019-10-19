import _ from "underscore";
import { Service } from "./service";
import { TokenHandler } from "../helpers/tokenHandler";
import { getBasicAuthHeader } from "../helpers/auth";

export class AuthService extends Service {
  constructor(client) {
    super(client, "auth");
  }
  async checkAuth(user) {
    return this.post(undefined, user);
  }
  async isAuth() {
    const token = await TokenHandler.getToken();
    return !_.isUndefined(token) && !_.isNull(token);
  }
  async createUser(user) {
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
  async _getToken() {
    if (_.isUndefined(this.client.userCredentials)) {
      throw new Error("User credentials required");
    }
    const user = this.client.userCredentials;
    return this.post("token", user);
  }
}
