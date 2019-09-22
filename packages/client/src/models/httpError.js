export class HTTPError extends Error {
  constructor(statusCode, headers, body) {
    super();
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
  }
}
