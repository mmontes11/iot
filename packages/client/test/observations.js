import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import observationConstants from "./lib/iot-server/test/constants/observations";
import authConstants from "./lib/iot-server/test/constants/auth";
import thingConstants from "./lib/iot-server/test/constants/thing";
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

describe("Observations", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  describe("POST /observations 401", () => {
    it("tries to createUser observations with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.observationsService.create(
          observationConstants.temperatureMeasurement,
        );
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /observations 304", () => {
    it("tries to createUser observations using an empty array", async () => {
      const emptyObservations = {
        observations: [],
      };
      const { statusCode } = await client.observationsService.create(emptyObservations);
      statusCode.should.equal(httpStatus.NOT_MODIFIED);
    });
  });

  describe("POST /observations 400", () => {
    it("tries to createUser observations using an invalid payload", async () => {
      try {
        const invalidPayload = {
          foo: [],
        };
        const { statusCode } = await client.observationsService.create(invalidPayload);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
    it("tries to createUser invalid observations", async () => {
      try {
        const invalidObservations = {
          observations: [
            observationConstants.invalidMeasurementWithKind,
            observationConstants.validMeasurementWithInvalidKind,
            observationConstants.invalidEventWithKind,
            observationConstants.validEventWithInvalidKind,
          ],
        };
        const { statusCode } = await client.observationsService.create(invalidObservations);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("POST /observations 201", () => {
    it("creates observations", async () => {
      const validObservations = {
        observations: [observationConstants.validMeasurementWithKind, observationConstants.validEventWithKind],
        thing: thingConstants.thingAtNYC,
      };
      const { statusCode } = await client.observationsService.create(validObservations);
      statusCode.should.equal(httpStatus.CREATED);
    });
  });

  describe("POST /observations 207", () => {
    it("creates observations and tries to create invalid ones", async () => {
      const measurements = [
        observationConstants.validMeasurementWithKind,
        observationConstants.validMeasurementWithInvalidKind,
        observationConstants.invalidMeasurementWithKind,
      ];
      const events = [
        observationConstants.validEventWithKind,
        observationConstants.validEventWithInvalidKind,
        observationConstants.invalidEventWithKind,
      ];
      const validAndInvalidObservations = {
        observations: [...measurements, ...events],
        thing: thingConstants.thingAtNYC,
      };
      const { statusCode } = await client.observationsService.create(validAndInvalidObservations);
      statusCode.should.equal(httpStatus.MULTI_STATUS);
    });
  });
});
