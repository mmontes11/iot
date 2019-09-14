import { Server } from "http";
import _ from "underscore";
import mongoose from "./lib/mongoose";
import redis from "./lib/redis";
import mqtt from "./lib/mqtt";
import app from "./lib/express";
import config from "./config/index";
import { logInfo, logError } from "./utils/log";

const server = new Server(app);

mongoose.connection.on("connected", () => {
  logInfo(`Connected to MongoDB ${config.mongoUrl}`);
});
mongoose.connection.on("error", err => {
  logError(`Error in MongoDB ${config.mongoUrl}:`);
  logError(err);
});
mongoose.connection.on("disconnected", () => {
  logInfo(`Disconnected from MongoDB ${config.mongoUrl}`);
});

redis.on("connect", () => {
  logInfo(`Connected to Redis ${config.redisUrl}`);
});
redis.on("error", err => {
  logError(`Error in Redis ${config.redisUrl}:`);
  logError(err);
});
redis.on("end", () => {
  logInfo(`Disconnected from Redis ${config.redisUrl}`);
});

const mqttBrokerUrl = `mqtt://${config.mqttBrokerHost}:${config.mqttBrokerPort}`;
mqtt.on("connect", () => {
  logInfo(`Connected to MQTT Broker ${mqttBrokerUrl}`);
});
mqtt.on("error", err => {
  logError(`Error in MQTT Broker ${mqttBrokerUrl}:`);
  logError(err);
});
mqtt.on("close", () => {
  logInfo(`Disconnected from MQTT Broker ${mqttBrokerUrl}`);
});

server.on("error", err => {
  logError(`Error in NodeJS server on port ${config.nodePort}:`);
  logError(err);
});
server.on("close", () => {
  logInfo(`Stopped NodeJS server on port ${config.nodePort}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close();
  redis.quit();
  mqtt.end();
  server.close();
});

server.listen(config.nodePort, err => {
  if (_.isUndefined(err) || _.isNull(err)) {
    logInfo(`NodeJS server started on port ${config.nodePort}`);
  }
});

export default server;
