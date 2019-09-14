import httpStatus from "http-status";
import _ from "underscore";
import Promise from "bluebird";
import chai from "./lib/chai";
import { MeasurementModel } from "../src/models/measurement";
import { EventModel } from "../src/models/event";
import { ThingModel } from "../src/models/thing";
import server from "../src/index";
import constants from "./constants/observations";
import authConstants from "./constants/auth";
import responseKeys from "../src/utils/responseKeys";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;

describe("Observations", () => {
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

  beforeEach(done => {
    const promises = [MeasurementModel.remove({}), EventModel.remove({}), ThingModel.remove({})];
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  describe("POST /observations 304", () => {
    it("tries to create observations using an empty array", done => {
      const emptyObservations = {
        observations: [],
        thing: constants.validThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(emptyObservations)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_MODIFIED);
          done();
        });
    });
  });

  describe("POST /observations 400", () => {
    it("tries to create observations using an invalid payload", done => {
      const invalidPayload = {
        foo: [],
        thing: constants.validThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(invalidPayload)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to create invalid observations", done => {
      const invalidObservations = {
        observations: [
          constants.invalidMeasurementWithKind,
          constants.validMeasurementWithInvalidKind,
          constants.invalidEventWithKind,
          constants.validEventWithInvalidKind,
        ],
        thing: constants.validThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(invalidObservations)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidObservationsArrayKey]);
          should.not.exist(res.body[responseKeys.createdObservationsArrayKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          res.body[responseKeys.invalidObservationsArrayKey].length.should.be.eql(
            _.size(invalidObservations.observations),
          );
          done();
        });
    });
    it("tries to create observations with an invalid thing", done => {
      const invalidObservations = {
        observations: [constants.validMeasurementWithKind, constants.validEventWithKind],
        thing: constants.invalidThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(invalidObservations)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidThingKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to create observations with a thing that has an invalid geometry", done => {
      const invalidObservations = {
        observations: [constants.validMeasurementWithKind, constants.validEventWithKind],
        thing: constants.thingWithInvalidGeometry,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(invalidObservations)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidThingKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("POST /observations 201", () => {
    it("creates observations", done => {
      const validObservations = {
        observations: [constants.validMeasurementWithKind, constants.validEventWithKind],
        thing: constants.validThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(validObservations)
        .end((err, res) => {
          should.not.exist(err);
          should.not.exist(res.body[responseKeys.invalidObservationsArrayKey]);
          should.exist(res.body[responseKeys.createdObservationsArrayKey]);
          res.should.have.status(httpStatus.CREATED);
          res.body[responseKeys.createdObservationsArrayKey].length.should.be.eql(2);
          done();
        });
    });
  });

  describe("POST /observations 207", () => {
    it("creates observations and also tries to create invalid ones", done => {
      const measurements = [
        constants.validMeasurementWithKind,
        constants.validMeasurementWithInvalidKind,
        constants.invalidMeasurementWithKind,
      ];
      const events = [
        constants.validEventWithKind,
        constants.validEventWithInvalidKind,
        constants.invalidEventWithKind,
      ];
      const validAndInvalidObservations = {
        observations: [...measurements, ...events],
        thing: constants.validThing,
      };
      chai
        .request(server)
        .post("/observations")
        .set("Authorization", auth())
        .send(validAndInvalidObservations)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res.body[responseKeys.invalidObservationsArrayKey]);
          should.exist(res.body[responseKeys.createdObservationsArrayKey]);
          res.should.have.status(httpStatus.MULTI_STATUS);
          res.body[responseKeys.invalidObservationsArrayKey].length.should.be.eql(4);
          res.body[responseKeys.createdObservationsArrayKey].length.should.be.eql(2);
          done();
        });
    });
  });
});
