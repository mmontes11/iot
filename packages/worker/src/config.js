import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.dev") });
}

export default {
  env: process.env.NODE_ENV,
  nodePort: process.env.WORKER_PORT,
  mongoUrl: process.env.MONGO_URL,
  mongoDb: process.env.MONGO_DB,
  mqttBrokerHost: process.env.MQTT_BROKER_HOST,
  mqttBrokerPort: process.env.MQTT_BROKER_PORT,
  mqttBrokerUsername: process.env.MQTT_BROKER_USERNAME,
  mqttBrokerPassword: process.env.MQTT_BROKER_PASSWORD,
  eventTopic: process.env.EVENT_TOPIC,
  measurementTopic: process.env.MEASUREMENT_TOPIC,
  measurementChangeTopic: process.env.MEASUREMENT_CHANGE_TOPIC,
  measurementChangePastIntervalInHours: parseFloat(process.env.MEASUREMENT_CHANGE_PAST_INTERVAL_IN_HOURS),
  measurementChangeGrowthRateThreshold: parseFloat(process.env.MEASUREMENT_CHANGE_GROWTH_RATE_THRESHOLD),
  biotUrl: process.env.BIOT_URL,
  biotBasicAuthUsername: process.env.BIOT_BASIC_AUTH_USERNAME,
  biotBasicAuthPassword: process.env.BIOT_BASIC_AUTH_PASSWORD,
  biotUsername: process.env.BIOT_USER,
  biotPassword: process.env.BIOT_PASSWORD,
  debug: process.env.IOT_DEBUG,
};
