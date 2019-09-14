import _ from "underscore";
import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { ThingModel } from "./lib/iot-server/src/models/thing";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import constants from "./constants/thing";
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

describe("Things", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  before(async () => {
    await ThingModel.remove({});
    const things = [
      thingConstants.thingAtACoruna,
      thingConstants.thingAtACoruna2,
      thingConstants.thingAtNYC,
      thingConstants.thingAtTokyo,
      thingConstants.thingWithEvents,
      thingConstants.thingWithEventsAndMeasurements,
      thingConstants.thingWithEventsAndMeasurements2,
    ];
    const createThingsPromises = _.map(things, thing => {
      const newThing = new ThingModel(thing);
      return newThing.save();
    });
    await Promise.all(createThingsPromises);
  });

  describe("GET /thing/X 401", () => {
    it("tries to get a thing with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.thingService.getThingByName(constants.existingThing);
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /things 401", () => {
    it("tries to get available things with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.thingsService.getThings();
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("GET /thing/X 404", () => {
    it("tries to get a non existing thing", async () => {
      try {
        const { statusCode } = await client.thingService.getThingByName(constants.nonExistingThing);
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /thing/X 200", () => {
    it("gets an existing thing", async () => {
      const { statusCode } = await client.thingService.getThingByName(constants.existingThing);
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /things 200", () => {
    it("gets available things", async () => {
      const { statusCode } = await client.thingsService.getThings();
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets things with supportsMeasurements = true and supportsEvents = false", async () => {
      const { statusCode } = await client.thingsService.getThings(true, false);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets things with supportsEvents = false", async () => {
      const { statusCode } = await client.thingsService.getThings(undefined, true);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets things with with supportsMeasurements = true and supportsEvents = true", async () => {
      const { statusCode } = await client.thingsService.getThings(true, true);
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /things 200", () => {
    it("gets available things", async () => {
      const { statusCode } = await client.thingsService.getThings();
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /things?supportsMeasurements=X&supportsEvents=X 404", () => {
    it("gets things with supportsMeasurements = true and supportsEvents = false", async () => {
      try {
        const { statusCode } = await client.thingsService.getThings(false, false);
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /things?supportsMeasurements=X&supportsEvents=X 200", () => {
    it("gets things with supportsMeasurements = true and supportsEvents = false", async () => {
      const { statusCode } = await client.thingsService.getThings(true, false);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets things with supportsEvents = false", async () => {
      const { statusCode } = await client.thingsService.getThings(undefined, true);
      statusCode.should.equal(httpStatus.OK);
    });
    it("gets things with with supportsMeasurements = true and supportsEvents = true", async () => {
      const { statusCode } = await client.thingsService.getThings(true, true);
      statusCode.should.equal(httpStatus.OK);
    });
  });
});
