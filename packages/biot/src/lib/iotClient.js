import { IoTClient } from "@mmontes11/iot-client/index";

const iotClient = new IoTClient({
  url: process.env.API_URL,
  username: process.env.BIOT_USER,
  password: process.env.BIOT_PASSWORD,
});

export default iotClient;
