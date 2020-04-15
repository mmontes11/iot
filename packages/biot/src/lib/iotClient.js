import { IoTClient } from "@mmontes11/iot-client/index";

const iotClient = new IoTClient({
  url: process.env.BACK_URL,
  username: process.env.BACK_USER,
  password: process.env.BACK_PASSWORD,
});

export default iotClient;
