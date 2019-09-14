import _ from "underscore";
import httpStatus from "http-status";
import chai from "./lib/chai";
import serverConfig from "./lib/iot-server/src/config/index";
import { UserModel } from "./lib/iot-server/src/models/user";
import { SubscriptionModel } from "./lib/iot-server/src/models/subscription";
import { TokenHandler } from "../src/helpers/tokenHandler";
import { IoTClient } from "../src/index";
import authConstants from "./lib/iot-server/test/constants/auth";
import subscriptionConstants from "./lib/iot-server/test/constants/subscription";
import responseKeys from "./lib/iot-server/src/utils/responseKeys";
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

describe("Subscription", () => {
  before(async () => {
    await TokenHandler.invalidateToken();
    assert((await TokenHandler.getToken()) === undefined, "Token should be undefined");
    await UserModel.remove({});
    await client.authService.createUser(authConstants.validUser);
  });

  beforeEach(async () => {
    const promises = [SubscriptionModel.remove({})];
    await Promise.all(promises);
  });

  describe("POST /subscription 401", () => {
    it("tries to create a subscription with invalid credentials", async () => {
      try {
        const { statusCode } = await clientWithInvalidCredentials.subscriptionService.subscribe(
          subscriptionConstants.validSubscription,
        );
        assert.fail(statusCode, httpStatus.UNAUTHORIZED, "Request should return 401 Unauthorized");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.UNAUTHORIZED);
      }
    });
  });

  describe("POST /subscription 400", () => {
    it("tries to create an invalid subscription", async () => {
      try {
        const { statusCode } = await client.subscriptionService.subscribe(subscriptionConstants.invalidSubscription);
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("POST /subscription 409", () => {
    it("tries to recreate an already created subscription", async () => {
      await client.subscriptionService.subscribe(subscriptionConstants.validSubscription);
      try {
        const { statusCode } = await client.subscriptionService.subscribe(subscriptionConstants.validSubscription);
        assert.fail(statusCode, httpStatus.CONFLICT, "Request should return 409 Conflict");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.CONFLICT);
      }
    });
  });

  describe("POST /subscription 201", () => {
    it("creates a subscription", async () => {
      const { statusCode } = await client.subscriptionService.subscribe(subscriptionConstants.validSubscription);
      statusCode.should.equal(httpStatus.CREATED);
    });
  });

  describe("DELETE /subscription 400", () => {
    it("tries to delete a subscription with an invalid subscription ID", async () => {
      try {
        const { statusCode } = await client.subscriptionService.unSubscribe(
          subscriptionConstants.invalidSubscriptionId,
        );
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("DELETE /subscription 404", () => {
    it("tries to delete a subscription  with non existing with subscription ID", async () => {
      try {
        const { statusCode } = await client.subscriptionService.unSubscribe(
          subscriptionConstants.nonExistingSubscriptionId,
        );
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("DELETE /subscription 201", () => {
    it("deletes a subscription", async () => {
      const {
        body: { _id: subscriptionId },
      } = await client.subscriptionService.subscribe(subscriptionConstants.validSubscription);
      const { statusCode } = await client.subscriptionService.unSubscribe(subscriptionId);
      statusCode.should.equal(httpStatus.OK);
    });
  });

  describe("GET /subscriptions 400", () => {
    it("tries to get subscriptions but no chatId query param is specified", async () => {
      try {
        const { statusCode } = await client.subscriptionsService.getSubscriptionsByChat();
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
    it("tries to get subscriptions with an invalid chatId query param", async () => {
      try {
        const { statusCode } = await client.subscriptionsService.getSubscriptionsByChat(
          subscriptionConstants.invalidChatId,
        );
        assert.fail(statusCode, httpStatus.BAD_REQUEST, "Request should return 400 Bad Request");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe("GET /subscriptions 404", () => {
    it("tries to get subscriptions but no one has been created yet", async () => {
      try {
        const { statusCode } = await client.subscriptionsService.getSubscriptionsByChat(
          subscriptionConstants.validChatId,
        );
        assert.fail(statusCode, httpStatus.NOT_FOUND, "Request should return 404 Not Found");
      } catch ({ statusCode }) {
        statusCode.should.equal(httpStatus.NOT_FOUND);
      }
    });
  });

  describe("GET /subscriptions 200", () => {
    it("gets subscriptions", async () => {
      const validSubscriptions = [
        subscriptionConstants.validSubscription,
        subscriptionConstants.validSubscription2,
        subscriptionConstants.validSubscription3,
      ];
      const promises = _.map(validSubscriptions, subscription => {
        const newSubscription = new SubscriptionModel(subscription);
        return newSubscription.save();
      });
      await Promise.all(promises);

      const { statusCode, body } = await client.subscriptionsService.getSubscriptionsByChat(
        subscriptionConstants.validChatId2,
      );
      statusCode.should.equal(httpStatus.OK);
      const subscriptions = body[responseKeys.subscriptionsArrayKey];
      subscriptions.length.should.equal(2);

      const subscriptionId = _.first(subscriptions)._id;
      await client.subscriptionService.unSubscribe(subscriptionId);

      const { statusCode: statusCode2, body: body2 } = await client.subscriptionsService.getSubscriptionsByChat(
        subscriptionConstants.validChatId2,
      );
      statusCode2.should.equal(httpStatus.OK);
      const secondSubscriptions = body2[responseKeys.subscriptionsArrayKey];
      secondSubscriptions.length.should.equal(1);
    });
  });
});
