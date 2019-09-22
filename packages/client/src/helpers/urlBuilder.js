export class URLBuilder {
  constructor(url, resource) {
    this.resourceUrl = `${url}/${resource}`;
  }
  build(path) {
    if (path) {
      return `${this.resourceUrl}/${path}`;
    }
    return `${this.resourceUrl}`;
  }
}
