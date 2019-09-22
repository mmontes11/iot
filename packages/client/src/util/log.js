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
  logRequest(request, id) {
    if (this.debug) {
      const {
        options: { method, query, data: body },
        url: { href: url },
        headers,
      } = request;
      if (!_.isUndefined(method) && !_.isUndefined(url)) {
        winston.info(`Request ${id} ${method} ${url}`);
      }
      if (!_.isUndefined(query)) {
        winston.info(`Request ${id} Query Params`);
        winston.info(Log._prettyPrintJSON(query));
      }
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
  logResponse(body, response, id) {
    if (this.debug) {
      const { statusCode, statusMessage, headers } = response;
      if (!_.isUndefined(statusCode) && !_.isUndefined(statusMessage)) {
        winston.info(`Response ${id} ${statusCode} ${statusMessage}`);
      }
      if (!_.isUndefined(body)) {
        winston.info(`Response ${id} Body`);
        winston.info(Log._prettyPrintJSON(body));
      }
      if (!_.isUndefined(headers)) {
        winston.info(`Response ${id} Headers`);
        winston.info(Log._prettyPrintJSON(headers));
      }
    }
  }
  static _prettyPrintJSON(json) {
    return JSON.stringify(json, undefined, 2);
  }
}
