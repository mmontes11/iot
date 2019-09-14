import winston from "../lib/winston";
import config from "../config/index";

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
  logMessage(msg) {
    const {
      from: { username: from },
      chat: { id: chatId, type: chatType },
      text,
      date,
    } = msg;
    const messageDate = new Date(date * 1000);
    this.logInfo(
      `@${from} sent a message in ${chatType} chat ${chatId}: ${text} (message time: ${messageDate.toISOString()})`,
    );
  }
  logCallbackQuery(callbackQuery) {
    const {
      from: { username: from },
      message: {
        date,
        chat: { type: chatType, id: chatId },
      },
      data,
    } = callbackQuery;
    const messageDate = new Date(date * 1000);
    this.logInfo(
      `@${from} replied to a query in ${chatType} chat ${chatId}: ${data} (reply time: ${messageDate.toISOString()})`,
    );
  }
  logReceivedNotifications(notifications) {
    this.logInfo("Received notifications:");
    this.logInfo(Log._pretifyJSON(notifications));
  }
  static _pretifyJSON(json) {
    return JSON.stringify(json, undefined, 2);
  }
}

const log = new Log(config.biotDebug);

export default log;
