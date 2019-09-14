import { IoTClient } from "@mmontes11/iot-client";
import config from "../config/index";

const iotClient = new IoTClient({
  url: config.iotServerUrl,
  basicAuthUsername: config.iotServerBasicAuthUsername,
  basicAuthPassword: config.iotServerBasicAuthPassword,
  username: config.iotServerUsername,
  password: config.iotServerPassword,
});

export default iotClient;
