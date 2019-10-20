import httpStatus from "http-status";
import _ from "underscore";
import Promise from "bluebird";
import chai from "./lib/chai";
import { EventModel } from "../src/models/event";
import { ThingModel } from "../src/models/thing";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import constants from "./constants/event";
import authConstants from "./constants/auth";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;
const createEvents = (events, done) => {
  Promise.each(events, event => {
    const newEvent = new EventModel(Object.assign({}, event, { phenomenonTime: new Date() }));
    return newEvent.save();
  })
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    });
};
const ensureNoEventsCreated = done => {
  EventModel.find()
    .then(events => {
      if (_.isEmpty(events)) {
        done();
      } else {
        done(new Error("Some events have been created"));
      }
    })
    .catch(err => {
      done(err);
    });
};

describe("Event", () => {
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
          .send(authConstants.validUser)
          .end((errInnerReq, { body: { token: tokenInnerReq } }) => {
            assert(tokenInnerReq !== undefined, "Error obtaining token");
            token = tokenInnerReq;
            done();
          });
      });
  });

  beforeEach(done => {
    const promises = [EventModel.remove({}), ThingModel.remove({})];
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  describe("POST /api/event 400", () => {
    it("tries to create an invalid event", done => {
      chai
        .request(server)
        .post("/api/event")
        .set("Authorization", auth())
        .send(constants.eventRequestWithInvalidEvent)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidEventKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoEventsCreated(done);
        });
    });
    it("tries to create an event with an invalid thing", done => {
      chai
        .request(server)
        .post("/api/event")
        .set("Authorization", auth())
        .send(constants.eventRequestWithInvalidThing)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidThingKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoEventsCreated(done);
        });
    });
    it("tries to create an event with a thing that has an invalid geometry", done => {
      chai
        .request(server)
        .post("/api/event")
        .set("Authorization", auth())
        .send(constants.eventRequestWithThingWithInvalidGeometry)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidThingKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoEventsCreated(done);
        });
    });
  });

  describe("POST /api/event 200", () => {
    it("creates an event", done => {
      chai
        .request(server)
        .post("/api/event")
        .set("Authorization", auth())
        .send(constants.validEventRequest)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          done();
        });
    });
    it("creates an event with value", done => {
      chai
        .request(server)
        .post("/api/event")
        .set("Authorization", auth())
        .send(constants.validEventRequestWithValue)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          done();
        });
    });
  });

  describe("GET /api/event/types 404", () => {
    it("gets all event types but no one has been created yet", done => {
      chai
        .request(server)
        .get("/api/event/types")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /api/event/types 200", () => {
    beforeEach(done => {
      createEvents([constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent], done);
    });
    it("gets all event types", done => {
      chai
        .request(server)
        .get("/api/event/types")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.types.should.be.a("array");
          res.body.types.length.should.be.eql(3);
          done();
        });
    });
  });

  describe("GET /api/event/last 404", () => {
    it("gets the last event but no one has been created yet", done => {
      chai
        .request(server)
        .get("/api/event/last")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /api/event/last 200", () => {
    beforeEach(done => {
      createEvents([constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent], done);
    });
    it("gets the last event", done => {
      chai
        .request(server)
        .get("/api/event/last")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.type.should.be.a("string");
          res.body.type.should.equal("window_opened");
          done();
        });
    });
  });

  describe("GET /api/event/last?type=X&thing=Y 404", () => {
    it("gets the last event of a non existing type", done => {
      chai
        .request(server)
        .get("/api/event/last")
        .query({
          type: "whatever",
          thing: "whatever",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /api/event/last?type=X&thing=Y 200", () => {
    beforeEach(done => {
      createEvents(
        [constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent, constants.doorClosedEvent2],
        done,
      );
    });
    it("gets the last door closed event", done => {
      chai
        .request(server)
        .get("/api/event/last")
        .query({
          type: "door_closed",
          thing: "arduino",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.type.should.be.a("string");
          res.body.type.should.equal("door_closed");
          res.body.thing.should.be.a("string");
          res.body.thing.should.equal("arduino");
          done();
        });
    });
  });

  describe("GET /api/event/stats 200", () => {
    beforeEach(done => {
      createEvents(
        [constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent, constants.doorClosedEvent2],
        done,
      );
    });
    it("gets event stats", done => {
      chai
        .request(server)
        .get("/api/event/stats")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          done();
        });
    });

    describe("GET /api/measurement 200", () => {
      beforeEach(done => {
        createEvents([constants.doorOpenedEvent, constants.doorClosedEvent, constants.windowOpenedEvent], done);
      });
      it("gets event data grouped by minute", done => {
        chai
          .request(server)
          .get("/api/event")
          .query({
            groupBy: "minute",
          })
          .set("Authorization", auth())
          .end((err, res) => {
            should.not.exist(err);
            res.should.have.status(httpStatus.OK);
            res.body.should.be.a("object");
            res.body.data.should.be.a("array");
            done();
          });
      });
    });
  });
});
