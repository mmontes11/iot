import { IoTClient } from "@mmontes11/iot-client/src/index";
import config from "../config";

const iotClient = new IoTClient({
  url: config.iotServerUrl,
  basicAuthUsername: config.iotServerBasicAuthUsername,
  basicAuthPassword: config.iotServerBasicAuthPassword,
  username: config.iotServerUsername,
  password: config.iotServerPassword,
});

export default iotClient;
