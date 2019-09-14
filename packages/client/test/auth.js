import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import serverConstants from "./lib/iot-server/test/constants/auth";
import clientConstants from "./constants/auth";
import measurementConstants from "./lib/iot-server/test/constants/measurement";
import "./lib/iot-server/src/index";

const { assert } = chai;
const should = chai.should();
const url = `http://localhost:${serverConfig.nodePort}`;
const basicAuthUsername = Object.keys(serverConfig.basicAuthUsers)[0];
const basicAuthPassword = serverConfig.basicAuthUsers[basicAuthUsername];
const { username, password } = serverConstants.validUser;
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

describe("Auth", () => {
  beforeEach(async () => {
    await client.authService.logout();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(serverConstants.validUser);
  });

  describe("POST /auth 401", () => {
    it("tries to check auth with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.authService.checkAuth(serverConstants.validUser);
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /auth 401", () => {
    it("checks auth of an user with invalid credentials", async () => {
      try {
        const { statusCode } = await client.authService.checkAuth(serverConstants.invalidUser);
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /auth 200", () => {
    it("checks auth of an user with valid credentials", async () => {
      const { statusCode } = await client.authService.checkAuth(serverConstants.validUser);
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("POST /auth/user 401", () => {
    it("tries to create user a user with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.authService.createUser(serverConstants.validUser);
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /auth/user 400", () => {
    it("tries to createUser an invalid user", async () => {
      try {
        const { statusCode } = await client.authService.createUser(serverConstants.invalidUser);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
    it("tries to createUser a user with weak password", async () => {
      try {
        const { statusCode } = await client.authService.createUser(serverConstants.userWithWeakPassword);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("POST /auth/user 409", () => {
    it("creates the same user twice", async () => {
      await UserModel.remove({});
      await client.authService.createUser(serverConstants.validUser);
      try {
        const { statusCode } = await client.authService.createUser(serverConstants.validUser);
        assert.fail(statusCode, httpStatus.CONFLICT, "Request should return 409 Conflict");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.CONFLICT);
      }
    });
  });

  describe("POST /auth/user 200", () => {
    it("creates a user", async () => {
      await UserModel.remove({});
      const { statusCode } = await client.authService.createUser(serverConstants.validUser);
      statusCode.should.equal(httpStatus.CREATED);
    });
  });

  describe("POST /auth/token 401", () => {
    it("tries to get a token with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.authService.getToken();
        assert.fail(statusCode, httpStatus, "Request should return 401 Unauthorized");
      } catch (err) {
        err.should.have.property("statusCode", httpStatus.UNAUTHORIZED);
      }
    });
    it("tries to use an invalid token in a request that requires auth and then deletes it", async () => {
      await TokenHandler.storeToken(clientConstants.invalidToken);
      try {
        const { statusCode } = await client.measurementService.create(
          measurementConstants.validMeasurementRequestWithThingInNYC,
        );
        assert(statusCode, httpStatus.UNAUTHORIZED, "Request should fail and return a 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
        should.not.exist(await TokenHandler.getToken());
      }
    });
  });

  describe("POST /auth/token 200", () => {
    it("gets a token for a valid user", async () => {
      const token = await client.authService.getToken();
      token.should.equal(await TokenHandler.getToken());
    });
    it("gets a token for a valid user and then deletes it", async () => {
      const token = await client.authService.getToken();
      token.should.equal(await TokenHandler.getToken());
      await TokenHandler.invalidateToken();
      should.not.exist(await TokenHandler.getToken());
    });
  });

  describe("Provides auth after library initialization", () => {
    const clientNoAuth = new IoTClient({
      url,
      basicAuthUsername,
      basicAuthPassword,
    });
    it("should have no auth", async () => {
      (await clientNoAuth.authService.isAuth()).should.equal(false);
    });
    it("should raise an error when attempting to obtain a token", async () => {
      try {
        await clientNoAuth.authService.getToken();
        assert(false, "It should raise an error");
      } catch (err) {
        should.exist(err);
      }
    });
    it("gets a token after setting credentials", async () => {
      clientNoAuth.authService.setCredentials(username, password);
      const token = await clientNoAuth.authService.getToken();
      should.exist(token);
      (await clientNoAuth.authService.isAuth()).should.equal(true);
    });
  });
});
