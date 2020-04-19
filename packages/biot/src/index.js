import "dotenv/config";
import { Server } from "http";
import _ from "underscore";
import telegramBotController from "./controllers/bot/telegramBotController";
import express from "./lib/express";
import log from "./utils/log";

telegramBotController.listen();
const server = new Server(express);
const { BIOT_SERVICE_PORT } = process.env;

server.on("error", err => {
  log.logError(`Error in NodeJS server on port ${BIOT_SERVICE_PORT}:`);
  log.logError(err);
});
server.on("close", () => {
  log.logInfo(`Stopped NodeJS server on port ${BIOT_SERVICE_PORT}`);
});

server.listen(BIOT_SERVICE_PORT, err => {
  if (_.isUndefined(err) || _.isNull(err)) {
    log.logInfo(`NodeJS server started on port ${BIOT_SERVICE_PORT}`);
  } else {
    log.logError(err);
  }
});

process.on("SIGINT", () => {
  telegramBotController.stop();
  server.close();
});
