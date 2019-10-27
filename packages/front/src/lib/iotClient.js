import { IoTClient } from "@mmontes11/iot-client/index";

const iotClient = new IoTClient({
  url: process.env.FRONT_API_URL,
});

export default iotClient;
