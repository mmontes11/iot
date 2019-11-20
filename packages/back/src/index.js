import "common/config";
import { Server } from "http";
import mongoose, { connectWithRetry } from "./lib/mongoose";
import redis from "./lib/redis";
import mqtt from "./lib/mqtt";
import app from "./lib/express";
import { setupSocketIO } from "./lib/socketIO";
import { SocketController } from "./controllers/socket/socketController";
import { logInfo, logError } from "./utils/log";

const server = new Server(app);
const io = setupSocketIO(server);

const { MONGO_URL, REDIS_URL, MQTT_BROKER_URL, BACK_PORT } = process.env;

connectWithRetry();
mongoose.connection.on("connected", () => {
  logInfo(`Connected to MongoDB ${MONGO_URL}`);
});
mongoose.connection.on("error", err => {
  logError(`Error in MongoDB ${MONGO_URL}:`);
  logError(err);
});
mongoose.connection.on("disconnected", () => {
  logInfo(`Disconnected from MongoDB ${MONGO_URL}`);
});

redis.on("connect", () => {
  logInfo(`Connected to Redis ${REDIS_URL}`);
});
redis.on("error", err => {
  logError(`Error in Redis ${REDIS_URL}:`);
  logError(err);
});
redis.on("end", () => {
  logInfo(`Disconnected from Redis ${process.env.REDIS_URL}`);
});

mqtt.on("connect", () => {
  logInfo(`Connected to MQTT Broker ${MQTT_BROKER_URL}`);
});
mqtt.on("error", err => {
  logError(`Error in MQTT Broker ${MQTT_BROKER_URL}`);
  logError(err);
});
mqtt.on("close", () => {
  logInfo(`Disconnected from MQTT Broker ${MQTT_BROKER_URL}`);
});

server.on("error", err => {
  logError(`Error in NodeJS server on port ${BACK_PORT}:`);
  logError(err);
});
server.on("close", () => {
  logInfo(`Stopped NodeJS server on port ${BACK_PORT}`);
});

server.listen(BACK_PORT, err => {
  if (!err) {
    logInfo(`NodeJS server started on port ${BACK_PORT}`);
  }
});

const socketController = new SocketController(io);
socketController.listen();

process.on("SIGINT", () => {
  mongoose.connection.close();
  redis.quit();
  mqtt.end();
  server.close();
  socketController.close();
});

export default server;
