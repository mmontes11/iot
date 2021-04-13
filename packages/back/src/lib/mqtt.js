import mqtt from "async-mqtt";

const mqttClient = mqtt.connect({
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
});

export default mqttClient;
