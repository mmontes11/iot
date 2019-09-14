import _ from "underscore";
import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { TopicModel } from "./lib/iot-server/src/models/topic";
import { UserModel } from "./lib/iot-server/src/models/user";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import authConstants from "./lib/iot-server/test/constants/auth";
import topicsConstants from "./lib/iot-server/test/constants/topics";
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

describe("Topics", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  before(async () => {
    await TopicModel.remove({});
  });

  describe("GET /topics 404", () => {
    it("tries to get topics but no one has been created yet", async () => {
      try {
        const { statusCode } = await client.topicsService.getTopics();
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /topics 200", () => {
    before(async () => {
      const topics = [topicsConstants.validTopic, topicsConstants.validTopic2, topicsConstants.validTopic3];
      const promises = _.map(topics, topic => {
        const newTopic = new TopicModel(topic);
        return newTopic.save();
      });
      await Promise.all(promises);
    });
    it("gets topics", async () => {
      const { statusCode } = await client.topicsService.getTopics();
      statusCode.should.equal(httpStatus.OK);
    });
  });
});
