import _ from "underscore";
import winston from "../lib/winston";

class Log {
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
  logMQTTTReceivedMessage(topic, json) {
    this.logInfo(`Message received from topic ${topic} :`);
    this.logInfo(Log._pretifyJSON(json));
  }
  logMQTTPublish(topic, json) {
    this.logInfo(`Published in topic ${topic} :`);
    this.logInfo(Log._pretifyJSON(json));
  }
  logRequest(request, id) {
    if (this.debug) {
      const {
        options: { method },
        url: { href: url },
      } = request;
      if (!_.isUndefined(method) && !_.isUndefined(url)) {
        winston.info(`Request ${id} ${method} ${url}`);
      }
      const {
        options: { query },
      } = request;
      if (!_.isUndefined(query)) {
        winston.info(`Request ${id} Query Params`);
        winston.info(Log._pretifyJSON(query));
      }
      const {
        options: { data: body },
      } = request;
      if (!_.isUndefined(body)) {
        winston.info(`Request ${id} Body`);
        winston.info(Log._pretifyJSON(JSON.parse(body)));
      }
      const { headers } = request;
      if (!_.isUndefined(headers)) {
        winston.info(`Request ${id} Headers`);
        winston.info(Log._pretifyJSON(headers));
      }
    }
  }
  logResponse(body, response, id) {
    if (this.debug) {
      const { statusCode, statusMessage } = response;
      if (!_.isUndefined(statusCode) && !_.isUndefined(statusMessage)) {
        winston.info(`Response ${id} ${statusCode} ${statusMessage}`);
      }
      if (!_.isUndefined(body)) {
        winston.info(`Response ${id} Body`);
        winston.info(Log._pretifyJSON(body));
      }
      const { headers } = response;
      if (!_.isUndefined(headers)) {
        winston.info(`Response ${id} Headers`);
        winston.info(Log._pretifyJSON(headers));
      }
    }
  }
  static _pretifyJSON(json) {
    return JSON.stringify(json, undefined, 2);
  }
}

const log = new Log(process.env.DEBUG);

export default log;
