import httpStatus from "http-status";
import _ from "underscore";
import Promise from "bluebird";
import chai from "./lib/chai";
import { SubscriptionModel } from "../src/models/subscription";
import { TopicModel } from "../src/models/topic";
import server from "../src/index";
import authConstants from "./constants/auth";
import subscriptionConstants from "./constants/subscription";
import topicConstants from "./constants/topics";
import responseKeys from "../src/utils/responseKeys";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;

describe("Subscriptions", () => {
  before(done => {
    chai
      .request(server)
      .post("/api/auth/user")
      .set("Authorization", authConstants.validAuthHeader)
      .send(authConstants.validUser)
      .end(err => {
        assert(err !== undefined, "Error creating user");
        chai
          .request(server)
          .post("/api/auth/token")
          .set("Authorization", authConstants.validAuthHeader)
          .send(authConstants.validUser)
          .end((errInnerReq, { body: { token: tokenInnerReq } }) => {
            assert(tokenInnerReq !== undefined, "Error obtaining token");
            token = tokenInnerReq;
            done();
          });
      });
  });

  beforeEach(done => {
    SubscriptionModel.remove({})
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  describe("POST /api/subscription 400", () => {
    it("tries to create an invalid subscription", done => {
      chai
        .request(server)
        .post("/api/subscription")
        .set("Authorization", auth())
        .send(subscriptionConstants.invalidSubscription)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to create a subscription with an invalid topicId", done => {
      chai
        .request(server)
        .post("/api/subscription")
        .set("Authorization", auth())
        .send(subscriptionConstants.subscriptionWithInvalidTopicId)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("POST /api/subscription 409", () => {
    it("tries to recreate an already created subscription", done => {
      chai
        .request(server)
        .post("/api/subscription")
        .set("Authorization", auth())
        .send(subscriptionConstants.validSubscription)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);

          chai
            .request(server)
            .post("/api/subscription")
            .set("Authorization", auth())
            .send(subscriptionConstants.validSubscription)
            .end((errInnerReq, resInnerReq) => {
              should.exist(errInnerReq);
              resInnerReq.should.have.status(httpStatus.CONFLICT);
              done();
            });
        });
    });
  });

  describe("POST /api/subscription 201", () => {
    it("creates a subscription", done => {
      chai
        .request(server)
        .post("/api/subscription")
        .set("Authorization", auth())
        .send(subscriptionConstants.validSubscription)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          done();
        });
    });
    it("creates a subscription using topicId", done => {
      const newTopic = new TopicModel(topicConstants.validTopic);
      newTopic
        .save()
        .then(() => {
          const subscription = {
            chatId: subscriptionConstants.validChatId,
            topicId: newTopic._id,
          };
          chai
            .request(server)
            .post("/api/subscription")
            .set("Authorization", auth())
            .send(subscription)
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(httpStatus.CREATED);
              done();
            });
        })
        .catch(err => done(err));
    });
  });

  describe("DELETE /api/subscription 400", () => {
    it("tries to delete a subscription with an invalid subscription ID", done => {
      chai
        .request(server)
        .delete(`/api/subscription/${subscriptionConstants.invalidSubscriptionId}`)
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("DELETE /api/subscription 404", () => {
    it("tries to delete a subscription  with non existing with subscription ID", done => {
      chai
        .request(server)
        .delete(`/api/subscription/${subscriptionConstants.nonExistingSubscriptionId}`)
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("DELETE /api/subscription 200", () => {
    it("deletes a subscription", done => {
      chai
        .request(server)
        .post("/api/subscription")
        .set("Authorization", auth())
        .send(subscriptionConstants.validSubscription)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          const subscriptionId = res.body._id;

          chai
            .request(server)
            .delete(`/api/subscription/${subscriptionId}`)
            .set("Authorization", auth())
            .end((errInnerReq, resInnerReq) => {
              should.not.exist(errInnerReq);
              resInnerReq.should.have.status(httpStatus.OK);
              done();
            });
        });
    });
  });

  describe("GET /api/subscriptions 400", () => {
    it("tries to get subscriptions but no chatId query param is specified", done => {
      chai
        .request(server)
        .get("/api/subscriptions")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.mandatoryQueryParamKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to get subscriptions with an invalid chatId query param", done => {
      chai
        .request(server)
        .get("/api/subscriptions")
        .set("Authorization", auth())
        .query({
          [responseKeys.chatIdKey]: subscriptionConstants.invalidChatId,
        })
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidQueryParamKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("GET /api/subscriptions 404", () => {
    it("tries to get subscriptions but no one has been created yet", done => {
      chai
        .request(server)
        .get("/api/subscriptions")
        .set("Authorization", auth())
        .query({
          [responseKeys.chatIdKey]: subscriptionConstants.validChatId,
        })
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /api/subscriptions 200", () => {
    it("gets subscriptions", done => {
      const subscriptions = [
        subscriptionConstants.validSubscription,
        subscriptionConstants.validSubscription2,
        subscriptionConstants.validSubscription3,
      ];
      const promises = _.map(subscriptions, subscription => {
        const newSubscription = new SubscriptionModel(subscription);
        return newSubscription.save();
      });
      Promise.all(promises)
        .then(() => {
          chai
            .request(server)
            .get("/api/subscriptions")
            .set("Authorization", auth())
            .query({
              [responseKeys.chatIdKey]: subscriptionConstants.validChatId2,
            })
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(httpStatus.OK);
              res.body[responseKeys.subscriptionsArrayKey].length.should.be.eql(2);
              const subscriptionId = _.first(res.body[responseKeys.subscriptionsArrayKey])._id;

              chai
                .request(server)
                .delete(`/api/subscription/${subscriptionId}`)
                .set("Authorization", auth())
                .end((errInnerReq, resInnerReq) => {
                  should.not.exist(errInnerReq);
                  resInnerReq.should.have.status(httpStatus.OK);

                  chai
                    .request(server)
                    .get("/api/subscriptions")
                    .set("Authorization", auth())
                    .query({
                      [responseKeys.chatIdKey]: subscriptionConstants.validChatId2,
                    })
                    .end((errInnerInnerReq, resInnerInnerReq) => {
                      should.not.exist(errInnerInnerReq);
                      resInnerInnerReq.should.have.status(httpStatus.OK);
                      resInnerInnerReq.body[responseKeys.subscriptionsArrayKey].length.should.be.eql(1);
                      done();
                    });
                });
            });
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
