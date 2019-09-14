import httpStatus from "http-status";
import Promise from "bluebird";
import chai from "./lib/chai";
import { ThingModel } from "../src/models/thing";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import constants from "./constants/thing";
import authConstants from "./constants/auth";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;
const createthings = (things, done) => {
  Promise.each(things, thing => {
    const newthing = new ThingModel(thing);
    return newthing.save();
  })
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    });
};

describe("Thing", () => {
  before(done => {
    chai
      .request(server)
      .post("/auth/user")
      .set("Authorization", authConstants.validAuthHeader)
      .send(authConstants.validUser)
      .end(err => {
        assert(err !== undefined, "Error creating user");
        chai
          .request(server)
          .post("/auth/token")
          .set("Authorization", authConstants.validAuthHeader)
          .send(authConstants.validUser)
          .end((errInnerReq, { body: { token: tokenInnerReq } }) => {
            assert(tokenInnerReq !== undefined, "Error obtaining token");
            token = tokenInnerReq;
            done();
          });
      });
  });

  before(done => {
    ThingModel.remove({}, err => {
      assert(err !== undefined, "Error cleaning MongoDB for tests");
      const things = [
        constants.thingAtACoruna,
        constants.thingAtACoruna2,
        constants.thingAtNYC,
        constants.thingAtTokyo,
        constants.thingWithEvents,
        constants.thingWithEventsAndMeasurements,
        constants.thingWithEventsAndMeasurements2,
      ];
      createthings(things, done);
    });
  });

  describe("GET /thing/X 404", () => {
    it("tries to get a non existing thing", done => {
      chai
        .request(server)
        .get("/thing/whatever")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /thing/X 200", () => {
    it("gets an existing thing", done => {
      chai
        .request(server)
        .get("/thing/raspi-coruna")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          done();
        });
    });
  });

  describe("GET /things?supportsEvents=X 400", () => {
    it("tries to get things providing invalid supportsEvent param", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsEvents: "foo",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidQueryParamKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to get things using invalid coordinates", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          latitude: 42.08,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidCoordinateParamsKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("GET /things?longitude=X&latitude=X 404", () => {
    it("gets things by Madagascar coordinates", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          longitude: -18.4,
          latitude: 43.37,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /things 200", () => {
    it("gets all things", done => {
      chai
        .request(server)
        .get("/things")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(7);
          done();
        });
    });
  });

  describe("GET /things?longitude=X&latitude=X 200", () => {
    it("gets things by A Coruna coordinates", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          longitude: -8.4065665,
          latitude: 43.3682188,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(2);
          done();
        });
    });

    it("gets things by A Coruna coordinates with max distance of 10 metres", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          longitude: -8.4065665,
          latitude: 43.3682188,
          maxDistance: 10,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(1);
          done();
        });
    });
  });

  describe("GET /things?supportsMeasurements=X&supportsEvents=X 400", () => {
    it("tries to get things with invalid supportsMeasurements and supportsEvents", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsMeasurements: constants.invalidSupportsMeasurementsQueryParam,
          supportsEvents: constants.invalidSupportsEventsQueryParam,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidQueryParamKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("GET /things?supportsMeasurements=X&supportsEvents=X 404", () => {
    it("tries to get things with supportsMeasurements = false and supportsEvents = false but no one matches", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsMeasurements: false,
          supportsEvents: false,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /things?supportsMeasurements=X&supportsEvents=X 200", () => {
    it("gets things with supportsMeasurements = true and supportsEvents = false", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsMeasurements: true,
          supportsEvents: false,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(4);
          done();
        });
    });
    it("gets things with supportsEvents = false", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsEvents: true,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(3);
          done();
        });
    });
    it("gets things with with supportsMeasurements = true and supportsEvents = true", done => {
      chai
        .request(server)
        .get("/things")
        .query({
          supportsMeasurements: true,
          supportsEvents: true,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body[responseKeys.thingsArrayKey].length.should.be.eql(2);
          done();
        });
    });
  });
});
