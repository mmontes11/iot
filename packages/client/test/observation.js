import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { MeasurementModel } from "./lib/iot-server/src/models/measurement";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import redisClient from "./lib/iot-server/src/lib/redis";
import serverConstants from "./lib/iot-server/test/constants/measurement";
import clientConstants from "./constants/measurement";
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

describe("Observation", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  beforeEach(async () => {
    const promises = [MeasurementModel.remove({}), redisClient.flushall()];
    await Promise.all(promises);
  });

  describe("POST /measurement 401", () => {
    it("tries to create a measurement with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.measurementService.create(
          serverConstants.temperatureMeasurement,
        );
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("GET /measurement/stats 401", () => {
    it("tries to get stats with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.measurementService.getStats();
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /measurement 400", () => {
    it("tries to create an invalid measurement", async () => {
      try {
        const { statusCode } = await client.measurementService.create(serverConstants.invalidMeasurementRequest);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("POST /measurement 200", () => {
    it("creates a measurement", async () => {
      const { statusCode } = await client.measurementService.create(
        serverConstants.validMeasurementRequestWithThingInNYC,
      );
      statusCode.should.equal(httpStatus.CREATED);
    });
  });

  describe("GET /measurement/stats?startDate=X&endDate=Y 400", () => {
    it("gets stats by a bad specified date range", async () => {
      try {
        const startDate = new Date();
        startDate.setHours(startDate.getHours() + 10);
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 5);
        const { statusCode } = await client.measurementService.getStats({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("GET /measurement/stats 404", () => {
    it("gets stats but no measurements have been created", async () => {
      try {
        const { statusCode } = await client.measurementService.getStats();
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /measurement/stats?queryParam=X 404", () => {
    beforeEach(async () => {
      const promises = [
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC),
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInCoruna),
      ];
      await Promise.all(promises);
    });
    it("gets stats by type but no one is available", async () => {
      try {
        const { statusCode } = await client.measurementService.getStatsByType(clientConstants.notAvailableType);
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
    it("gets stats by thing but no one is available", async () => {
      try {
        const { statusCode } = await client.measurementService.getStatsByThing(clientConstants.notAvailableThing);
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
    it("gets stats by date range but no one is available", async () => {
      try {
        const startDate = new Date();
        startDate.setHours(startDate.getHours() + 5);
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 10);
        const { statusCode } = await client.measurementService.getStatsByDateRange(
          startDate.toISOString(),
          endDate.toISOString(),
        );
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
    it("gets stats by coordinates but no one is available", async () => {
      try {
        const { statusCode } = await client.measurementService.getStatsByCoordinates(
          clientConstants.notAvailableCoordinates.longitude,
          clientConstants.notAvailableCoordinates.latitude,
          100,
        );
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /measurement/stats 200", () => {
    beforeEach(async () => {
      const promises = [
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC),
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInCoruna),
      ];
      await Promise.all(promises);
    });
    it("gets stats", async () => {
      const { statusCode } = await client.measurementService.getStats();
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets stats by time period", async () => {
      const { statusCode } = await client.measurementService.getStatsByTimePeriod(clientConstants.timePeriod);
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /measurement/stats?queryParam=X 200", () => {
    beforeEach(async () => {
      const promises = [
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC),
        client.measurementService.create(serverConstants.validMeasurementRequestWithThingInCoruna),
      ];
      await Promise.all(promises);
    });
    it("gets stats by type", async () => {
      const { statusCode } = await client.measurementService.getStatsByType(clientConstants.availableType);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets stats by thing", async () => {
      const { statusCode } = await client.measurementService.getStatsByThing(clientConstants.availableThing);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets stats by date", async () => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - 5);
      const endDate = new Date();
      endDate.setHours(endDate.getHours() + 10);
      const { statusCode } = await client.measurementService.getStatsByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
      );
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /measurement/last?thing=X&type=Y 404", () => {
    it("tries to get las measurement of a non existing thing", async () => {
      try {
        const { statusCode } = await client.measurementService.getLast(
          clientConstants.notAvailableThing,
          client.notAvailableType,
        );
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /measurement/last?thing=X&type=Y 200", () => {
    beforeEach(async () => {
      await client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC);
    });
    it("gets last measurement of a thing", async () => {
      const { statusCode } = await client.measurementService.getLast(
        clientConstants.availableThing,
        client.availableType,
      );
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /measurement/types 200", () => {
    beforeEach(async () => {
      await client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC);
    });
    it("gets measurement types", async () => {
      const { statusCode } = await client.measurementService.getTypes();
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /measurement/types 404", () => {
    it("tries to get measurement types but no one has been created yet", async () => {
      try {
        const { statusCode } = await client.measurementService.getTypes();
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /measurement 200", () => {
    beforeEach(async () => {
      await client.measurementService.create(serverConstants.validMeasurementRequestWithThingInNYC);
    });
    it("gets measurement data", async () => {
      const { statusCode } = await client.measurementService.getData();
      statusCode.should.equal(httpStatus.OK);
    });
  });
});
