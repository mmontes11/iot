import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.dev") });
}
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.test") });
}

export default {
  env: process.env.NODE_ENV,
  nodePort: process.env.BACK_PORT,
  mongoUrl: `${process.env.MONGO_URL}`,
  redisUrl: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  mqttBrokerHost: process.env.MQTT_BROKER_HOST,
  mqttBrokerPort: process.env.MQTT_BROKER_PORT,
  mqttBrokerUsername: process.env.MQTT_BROKER_USERNAME,
  mqttBrokerPassword: process.env.MQTT_BROKER_PASSWORD,
  defaultCacheInSeconds: process.env.BACK_DEFAULT_CACHE_IN_SECONDS,
  statsCacheInSeconds: process.env.BACK_STATS_CACHE_IN_SECONDS,
  maxDefaultNearbyDistanceInMeters: process.env.BACK_MAX_DEFAULT_NEARBY_DISTANCE_IN_METERS,
  maxNumOfThingsInStatsResults: process.env.BACK_MAX_NUM_OF_THINGS_IN_STATS_RESULTS,
  basicAuthUsers: {
    [`${process.env.BACK_BASIC_AUTH_USER}`]: `${process.env.BACK_BASIC_AUTH_PASSWORD}`,
  },
  jwtSecret: `${process.env.BACK_JWT_SECRET}`,
  googleMapsKey: `${process.env.GOOGLE_MAPS_KEY}`,
  thingSocketPort: process.env.THING_SOCKET_PORT,
  debug: process.env.IOT_DEBUG,
};
