import _ from "underscore";
import winston from "../lib/winston";

export class Log {
  constructor(debug) {
    this.debug = debug;
  }
  logInfo(message) {
    if (this.debug) {
      winston.info(message);
    }
  }
  logError(message) {
    if (this.debug) {
      winston.error(message);
    }
  }
  logRequest(id, url, options) {
    if (this.debug) {
      const { method, headers, body } = options;
      winston.info(`Request ${id} ${method} ${url}`);
      if (!_.isUndefined(body)) {
        winston.info(`Request ${id} Body`);
        winston.info(Log._prettyPrintJSON(JSON.parse(body)));
      }
      if (!_.isUndefined(headers)) {
        winston.info(`Request ${id} Headers`);
        winston.info(Log._prettyPrintJSON(headers));
      }
    }
  }
  logResponse(id, status, body) {
    if (this.debug) {
      winston.info(`Response ${id} ${status}`);
      if (!_.isUndefined(body)) {
        winston.info(`Response ${id} Body`);
        winston.info(Log._prettyPrintJSON(body));
      }
    }
  }
  static _prettyPrintJSON(json) {
    return JSON.stringify(json, undefined, 2);
  }
}
