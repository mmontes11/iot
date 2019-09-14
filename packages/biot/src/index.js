import { Server } from "http";
import _ from "underscore";
import telegramBotController from "./controllers/bot/telegramBotController";
import express from "./lib/express";
import config from "./config/index";
import log from "./utils/log";

telegramBotController.listen();
const server = new Server(express);

server.on("error", err => {
  log.logError(`Error in NodeJS server on port ${config.nodePort}:`);
  log.logError(err);
});
server.on("close", () => {
  log.logInfo(`Stopped NodeJS server on port ${config.nodePort}`);
});

server.listen(config.nodePort, err => {
  if (_.isUndefined(err) || _.isNull(err)) {
    log.logInfo(`NodeJS server started on port ${config.nodePort}`);
  } else {
    log.logError(err);
  }
});

process.on("SIGINT", () => {
  telegramBotController.stop();
  server.close();
});
