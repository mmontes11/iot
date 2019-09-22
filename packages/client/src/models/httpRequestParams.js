export class HTTPRequestParams {
  constructor(method, path, options, data) {
    this.method = method;
    this.path = path;
    this.options = options;
    this.data = data;
  }
}
