import _ from "underscore";
import { Service } from "./service";
import { TokenHandler } from "../helpers/tokenHandler";
import { Credentials } from "../models/credentials";

export class AuthService extends Service {
  constructor(client, basicAuthCredentials, userCredentials) {
    super(client, "auth");
    this.basicAuthCredentials = basicAuthCredentials;
    this.userCredentials = userCredentials;
  }
  async checkAuth(user) {
    return this._postWithBasicAuthCredentials(undefined, user);
  }
  async isAuth() {
    const token = await TokenHandler.getToken();
    return !_.isUndefined(token) && !_.isNull(token);
  }
  async createUser(user) {
    return this._postWithBasicAuthCredentials("user", user);
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
  setCredentials(username, password) {
    this.userCredentials = new Credentials(username, password);
  }
  logout() {
    return TokenHandler.invalidateToken();
  }
  async _postWithBasicAuthCredentials(path, data) {
    const basicAuthOptions = {
      username: this.basicAuthCredentials.username,
      password: this.basicAuthCredentials.password,
    };
    return this.post(path, basicAuthOptions, data, false);
  }
  async _getToken() {
    if (_.isUndefined(this.userCredentials)) {
      throw new Error("Credentials not provided");
    } else {
      const user = {
        username: this.userCredentials.username,
        password: this.userCredentials.password,
      };
      return this._postWithBasicAuthCredentials("token", user);
    }
  }
}
