import { IoTClient } from "@mmontes11/iot-client/index";
import store from "config/store";
// eslint-disable-next-line import/no-cycle
import { logout } from "actions/auth";

const handleExpiredToken = () => {
  store.dispatch(logout());
};

const iotClient = new IoTClient({
  url: process.env.FRONT_API_URL,
  handleExpiredToken,
});

export default iotClient;
