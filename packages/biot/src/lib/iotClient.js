import { IoTClient } from "@mmontes11/iot-client";

const iotClient = new IoTClient({
  url: process.env.API_URL,
  basicAuthUsername: process.env.BACK_BASIC_AUTH_USER,
  basicAuthPassword: process.env.BACK_BASIC_AUTH_PASSWORD,
  username: process.env.BIOT_USER,
  password: process.env.BIOT_PASSWORD,
});

export default iotClient;
