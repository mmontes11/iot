import { IoTClient } from "@mmontes11/iot-client";

const iotClient = new IoTClient({
  url: process.env.FRONT_API_URL,
  basicAuthUsername: process.env.BACK_BASIC_AUTH_USER,
  basicAuthPassword: process.env.BACK_BASIC_AUTH_PASSWORD,
});

export default iotClient;
