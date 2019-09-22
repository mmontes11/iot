export class MultiPlatformHelper {
  static isBrowser() {
    return typeof window !== "undefined";
  }
  static isNode() {
    return !MultiPlatformHelper.isBrowser();
  }
}
