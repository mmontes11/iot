import mqttLib from "async-mqtt";
import config from "../config";
import log from "../utils/log";

class MQTT {
  constructor(host, port, username, password) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.brokerUrl = `mqtt://${this.host}:${this.port}`;
  }
  connect() {
    this.client = mqttLib.connect({
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
    });
  }
  publishJSON(topic, json) {
    log.logMQTTPublish(topic, json);
    return this.client.publish(topic, JSON.stringify(json));
  }
}

const mqtt = new MQTT(
  config.mqttBrokerHost,
  config.mqttBrokerPort,
  config.mqttBrokerUsername,
  config.mqttBrokerPassword,
);

export default mqtt;
