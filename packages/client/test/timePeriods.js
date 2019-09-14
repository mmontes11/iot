import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import authConstants from "./lib/iot-server/test/constants/auth";
import "./lib/iot-server/src/index";

const { assert } = chai;
const url = `http://localhost:${serverConfig.nodePort}`;
const basicAuthUsername = Object.keys(serverConfig.basicAuthUsers)[0];
const basicAuthPassword = serverConfig.basicAuthUsers[basicAuthUsername];
const { username, password } = authConstants.validUser;
const client = new IoTClient({
  url,
  basicAuthUsername,
  basicAuthPassword,
  username,
  password,
});
const clientWithInvalidCredentials = new IoTClient({
  url,
  basicAuthUsername: "foo",
  basicAuthPassword: "bar",
  username: "foo",
  password: "bar",
});

describe("TimePeriod", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  describe("POST /timePeriods 401", () => {
    it("tries to get supported time periods with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.timePeriodsService.getSupportedTimePeriods();
        assert(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /timePeriods 200", () => {
    it("gets supported time periods", async () => {
      const { statusCode } = await client.timePeriodsService.getSupportedTimePeriods();
      statusCode.should.equal(httpStatus.OK);
    });
  });
});
