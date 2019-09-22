import nodePersist from "node-persist";
import { MultiPlatformHelper } from "./multiPlatformHelper";

const tokenKey = "token";

export class TokenHandler {
  static async initStorage() {
    if (MultiPlatformHelper.isNode()) {
      await nodePersist.init();
    }
  }
  static async getToken() {
    const storage = TokenHandler._getStorage();
    return storage.getItem(tokenKey);
  }
  static async storeToken(token) {
    const storage = TokenHandler._getStorage();
    return storage.setItem(tokenKey, token);
  }
  static async invalidateToken() {
    const storage = TokenHandler._getStorage();
    await storage.clear();
  }
  static _getStorage() {
    if (MultiPlatformHelper.isBrowser()) {
      return window.localStorage;
    }
    return nodePersist;
  }
}
