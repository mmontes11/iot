import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { IoTClient } from "../src/index";
import serverConstants from "./lib/iot-server/test/constants/auth";

const should = chai.should();
const url = `http://localhost:${serverConfig.nodePort}`;
const basicAuthUsername = Object.keys(serverConfig.basicAuthUsers)[0];
const basicAuthPassword = serverConfig.basicAuthUsers[basicAuthUsername];
const { username, password } = serverConstants.validUser;

describe("IoT Client", () => {
  describe("IoT Client initialization with error", () => {
    let iotClient;
    try {
      iotClient = new IoTClient({
        url,
      });
    } catch (err) {
      should.exist(err);
    }
    should.not.exist(iotClient);
  });

  describe("IoT Client successfully initialization", () => {
    it("creates an instance of IoT Client", () => {
      const iotClient = new IoTClient({
        url,
        basicAuthUsername,
        basicAuthPassword,
      });
      should.exist(iotClient);
    });
    it("creates an instance of IoT Client providing auth", () => {
      const iotClient = new IoTClient({
        url,
        basicAuthUsername,
        basicAuthPassword,
        username,
        password,
      });
      should.exist(iotClient);
    });
  });
});
