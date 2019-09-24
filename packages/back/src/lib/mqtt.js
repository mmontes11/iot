import mqtt from "async-mqtt";

const mqttClient = mqtt.connect({
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
  username: process.env.MQTT_BROKER_USERNAME,
  password: process.env.MQTT_BROKER_PASSWORD,
});

export default mqttClient;
