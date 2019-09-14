import mqtt from "async-mqtt";
import config from "../config/index";

const mqttClient = mqtt.connect({
  host: config.mqttBrokerHost,
  port: config.mqttBrokerPort,
  username: config.mqttBrokerUsername,
  password: config.mqttBrokerPassword,
});

export const mqttBrokerUrl = `mqtt://${config.mqttBrokerHost}:${config.mqttBrokerPort}`;

export default mqttClient;
