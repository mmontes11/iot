import httpStatus from "http-status";
import _ from "underscore";
import Promise from "bluebird";
import moment from "moment";
import chai from "./lib/chai";
import { MeasurementModel } from "../src/models/measurement";
import { ThingModel } from "../src/models/thing";
import redisClient from "../src/lib/redis";
import server from "../src/index";
import constants from "./constants/measurement";
import authConstants from "./constants/auth";
import responseKeys from "../src/utils/responseKeys";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;
const createMeasurements = (measurements, done) => {
  Promise.each(measurements, measurement => {
    const newMeasurement = new MeasurementModel(Object.assign({}, measurement, { phenomenonTime: new Date() }));
    return newMeasurement.save();
  })
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    });
};
const performMeasurementCreationRequest = (measurementRequests, done) => {
  Promise.all(measurementRequests)
    .then(() => {
      done();
    })
    .catch(err => {
      done(err);
    });
};
const ensureNoMeasurementsCreated = done => {
  MeasurementModel.find()
    .then(measurements => {
      if (_.isEmpty(measurements)) {
        done();
      } else {
        done(new Error("Some measurements have been created"));
      }
    })
    .catch(err => {
      done(err);
    });
};

describe("Measurement", () => {
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
    const promises = [MeasurementModel.remove({}), ThingModel.remove({}), redisClient.flushall()];
    Promise.all(promises)
      .then(() => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });

  describe("POST /measurement 400", () => {
    it("tries to create an invalid measurement", done => {
      chai
        .request(server)
        .post("/measurement")
        .set("Authorization", auth())
        .send(constants.measurementRequestWithInvalidMeasurement)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoMeasurementsCreated(done);
        });
    });
    it("tries to create a measurement with an invalid thing", done => {
      chai
        .request(server)
        .post("/measurement")
        .set("Authorization", auth())
        .send(constants.measurementRequestWithInvalidThing)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoMeasurementsCreated(done);
        });
    });
    it("tries to create a measurement with a thing that has an invalid geometry", done => {
      chai
        .request(server)
        .post("/measurement")
        .set("Authorization", auth())
        .send(constants.measurementRequestWithThingWithInvalidGeometry)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidThingKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          ensureNoMeasurementsCreated(done);
        });
    });
  });

  describe("POST /measurement 200", () => {
    it("creates a measurement", done => {
      chai
        .request(server)
        .post("/measurement")
        .set("Authorization", auth())
        .send(constants.validMeasurementRequestWithThingInCoruna)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          done();
        });
    });
  });

  describe("GET /measurement/types 404", () => {
    it("gets all measurement types but no one has been created yet", done => {
      chai
        .request(server)
        .get("/measurement/types")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/types 200", () => {
    beforeEach(done => {
      const measurements = [constants.temperatureMeasurement, constants.humidityMeasurement];
      createMeasurements(measurements, done);
    });
    it("gets all measurement types", done => {
      chai
        .request(server)
        .get("/measurement/types")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.types.should.be.a("array");
          res.body.types.length.should.be.eql(2);
          done();
        });
    });
  });

  describe("GET /measurement/last 404", () => {
    it("gets the last measurement but no one has been created yet", done => {
      chai
        .request(server)
        .get("/measurement/last")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/last 200", () => {
    beforeEach(done => {
      const events = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
      ];
      createMeasurements(events, done);
    });
    it("gets the last measurement", done => {
      chai
        .request(server)
        .get("/measurement/last")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.type.should.be.a("string");
          res.body.type.should.equal("humidity");
          done();
        });
    });
  });

  describe("GET /measurement/last?type=X&thing=Y 404", () => {
    it("gets the last measurement of a non existing type", done => {
      chai
        .request(server)
        .get("/measurement/last")
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

  describe("GET /measurement/last?type=X&thing=Y 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
      ];
      createMeasurements(measurements, done);
    });
    it("gets the last temperature measurement", done => {
      chai
        .request(server)
        .get("/measurement/last")
        .query({
          type: "temperature",
          thing: "raspberry",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.type.should.be.a("string");
          res.body.type.should.equal("temperature");
          res.body.thing.should.be.a("string");
          res.body.thing.should.equal("raspberry");
          res.body.value.should.be.a("number");
          res.body.value.should.equal(15);
          done();
        });
    });
  });

  describe("GET /measurement/stats 404", () => {
    it("gets measurement stats but no measurement has been created", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/stats 400", () => {
    it("gets measurement stats of a non valid time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          timePeriod: "whatever",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidTimePeriod]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("gets measurement stats of a non valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          startDate: "1-1-2013",
          endDate: "1-1-2018",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidDateRangeKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("gets measurement stats of a non valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          startDate: "2016-01-01",
          endDate: "2015-01-01",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidDateRangeKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("gets measurement stats of a non valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          startDate: "2016-01-01T01:00:00.000Z",
          endDate: "2015-01-01T01:00:00.000Z",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidDateRangeKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("gets measurement stats of a non valid location", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          longitude: -8.35,
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

  describe("GET /measurement/stats 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.temperatureMeasurement3,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
        constants.humidityMeasurement3,
      ];
      createMeasurements(measurements, done);
    });
    it("gets measurement stats", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement/stats?timePeriod=X&statDate=Y&endDate=Z 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.temperatureMeasurement3,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
        constants.humidityMeasurement3,
      ];
      createMeasurements(measurements, done);
    });
    it("gets measurement stats of a valid time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          timePeriod: "month",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets measurement stats of a valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets measurement stats of a valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
          endDate: moment()
            .utc()
            .add(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement/stats?type=X 404", () => {
    it("gets measurement stats by type but no measurement has been created", done => {
      chai
        .request(server)
        .get("/measurement/whatever/stats")
        .query({
          type: "whatever",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/stats?type=X 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
      ];
      createMeasurements(measurements, done);
    });
    it("gets temperature measurement stats", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets temperature measurement stats of a valid time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
          timePeriod: "month",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets temperature measurement stats of a valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
          endDate: moment()
            .utc()
            .add(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement/stats?thing=X 404", () => {
    it("gets measurement stats by thing but no measurement has been created", done => {
      chai
        .request(server)
        .get("/measurement/whatever/stats")
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/stats?thing=X 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.temperatureMeasurement3,
        constants.humidityMeasurement3,
      ];
      createMeasurements(measurements, done);
    });
    it("gets raspberry measurement stats", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          thing: "raspberry",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets raspberry measurement stats of a valid time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          thing: "raspberry",
          timePeriod: "month",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets raspberry measurement stats of a valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          thing: "raspberry",
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
          endDate: moment()
            .utc()
            .add(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement/stats?type=X&thing=Y 200", () => {
    beforeEach(done => {
      const measurements = [
        constants.temperatureMeasurement,
        constants.temperatureMeasurement2,
        constants.temperatureMeasurement3,
        constants.humidityMeasurement,
        constants.humidityMeasurement2,
        constants.humidityMeasurement3,
      ];
      createMeasurements(measurements, done);
    });
    it("gets temperature raspberry measurement stats", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
          thing: "raspberry",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets temperature raspberry measurement stats of a valid time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
          thing: "raspberry",
          timePeriod: "month",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets temperature raspberry measurement stats of a valid custom time period", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          type: "temperature",
          thing: "raspberry",
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
          endDate: moment()
            .utc()
            .add(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement/stats?longitude=X&latitude=Y 404", () => {
    beforeEach(done => {
      const measurementRequestBodies = [
        constants.validMeasurementRequestWithThingInCoruna,
        constants.validMeasurementRequestWithThingInNYC,
      ];
      const measurementRequestPromises = _.map(
        measurementRequestBodies,
        measurementRequestBody =>
          new Promise((resolve, reject) => {
            chai
              .request(server)
              .post("/measurement")
              .set("Authorization", auth())
              .send(measurementRequestBody)
              .end(err => {
                if (_.isUndefined(err)) {
                  resolve();
                } else {
                  reject(err);
                }
              });
          }),
      );
      performMeasurementCreationRequest(measurementRequestPromises, done);
    });
    it("gets stats from  coordinates that have no things", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          longitude: -3.0167342,
          latitude: 16.7714039,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement/stats?longitude=X&latitude=Y 200", () => {
    beforeEach(done => {
      const measurementRequestBodies = [
        constants.validMeasurementRequestWithThingInCoruna,
        constants.validMeasurementRequestWithThingInCoruna2,
        constants.validMeasurementRequestWithThingInNYC,
      ];
      const measurementRequestPromises = _.map(
        measurementRequestBodies,
        measurementRequestBody =>
          new Promise((resolve, reject) => {
            chai
              .request(server)
              .post("/measurement")
              .set("Authorization", auth())
              .send(measurementRequestBody)
              .end(err => {
                if (_.isUndefined(err)) {
                  resolve();
                } else {
                  reject(err);
                }
              });
          }),
      );
      performMeasurementCreationRequest(measurementRequestPromises, done);
    });
    it("gets stats from A Coruña coordinates", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          longitude: -8.4115401,
          latitude: 43.3623436,
          maxDistance: 100000,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
    it("gets stats from NYC coordinates", done => {
      chai
        .request(server)
        .get("/measurement/stats")
        .query({
          longitude: -74.25,
          latitude: 40.69,
          maxDistance: 100000,
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.stats.should.be.a("array");
          done();
        });
    });
  });

  describe("GET /measurement 400", () => {
    it("tries to get measurement data with invalid groupBy param", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          groupBy: "foo",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.BAD_REQUEST);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /measurement 404", () => {
    it("gets measurement data of a non existing thing", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          thing: "foo",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.NOT_FOUND);
          done();
        });
    });
  });

  describe("GET /measurement 200", () => {
    beforeEach(done => {
      const measurementRequestBodies = [
        constants.validMeasurementRequestWithThingInCoruna,
        constants.validMeasurementRequestWithThingInCoruna2,
        constants.validMeasurementRequestWithThingInNYC,
      ];
      const measurementRequestPromises = _.map(
        measurementRequestBodies,
        measurementRequestBody =>
          new Promise((resolve, reject) => {
            chai
              .request(server)
              .post("/measurement")
              .set("Authorization", auth())
              .send(measurementRequestBody)
              .end(err => {
                if (_.isUndefined(err)) {
                  resolve();
                } else {
                  reject(err);
                }
              });
          }),
      );
      performMeasurementCreationRequest(measurementRequestPromises, done);
    });
    it("gets measurement data grouped by minute", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          groupBy: "minute",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.measurementData.should.be.a("array");
          done();
        });
    });
    it("gets measurement data of an specific thing", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          thing: "raspi-coruna",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.measurementData.should.be.a("array");
          done();
        });
    });
    it("gets measurement data of an specific thing", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          thing: "raspi-coruna",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.measurementData.should.be.a("array");
          done();
        });
    });
    it("gets measurement data of a time period", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          timePeriod: "month",
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.measurementData.should.be.a("array");
          done();
        });
    });
    it("gets raspberry measurement stats of a custom time period", done => {
      chai
        .request(server)
        .get("/measurement")
        .query({
          startDate: moment()
            .utc()
            .subtract(1, "minute")
            .toISOString(),
          endDate: moment()
            .utc()
            .add(1, "minute")
            .toISOString(),
        })
        .set("Authorization", auth())
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.OK);
          res.body.should.be.a("object");
          res.body.measurementData.should.be.a("array");
          done();
        });
    });
  });
});
