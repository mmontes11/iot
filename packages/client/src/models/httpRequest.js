import rest from "restler";
import httpStatus from "http-status";
import _ from "underscore";
import { HTTPMethod } from "./httpMethod";
import { HTTPError } from "./httpError";
import { TokenHandler } from "../helpers/tokenHandler";

export class HTTPRequest {
  constructor(method, url, options, data, log) {
    this.id = new Date().getTime();
    this.method = method;
    this.url = url;
    this.options = options;
    this.data = data;
    this.log = log;
  }
  _createRequest() {
    switch (this.method) {
      case HTTPMethod.GET: {
        return rest.get(this.url, this.options);
      }
      case HTTPMethod.POST: {
        return rest.postJson(this.url, this.data, this.options);
      }
      case HTTPMethod.DELETE: {
        return rest.del(this.url, this.options);
      }
      default: {
        throw new Error("Unsupported HTTP method");
      }
    }
  }
  start() {
    const request = this._createRequest();
    const { id: requestId, log } = this;
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
        .on("fail", async (data, response) => {
          log.logInfo(`Request ${requestId} failed`);
          log.logResponse(data, response, requestId);
          if (_.isEqual(response.statusCode, httpStatus.UNAUTHORIZED)) {
            await TokenHandler.invalidateToken();
          }
          reject(new HTTPError(response.statusCode, response.headers, data));
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
}
