import mqttLib from "async-mqtt";
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
  process.env.MQTT_BROKER_HOST,
  process.env.MQTT_BROKER_PORT,
  process.env.MQTT_BROKER_USERNAME,
  process.env.MQTT_BROKER_PASSWORD,
);

export default mqtt;
