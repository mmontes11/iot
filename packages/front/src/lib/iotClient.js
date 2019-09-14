import { IoTClient } from "@mmontes11/iot-client";

const iotClient = new IoTClient({
  url: process.env.IOT_SERVER_API_URL,
  basicAuthUsername: process.env.IOT_SERVER_BASIC_AUTH_USERNAME,
  basicAuthPassword: process.env.IOT_SERVER_BASIC_AUTH_PASSWORD,
});

export default iotClient;
