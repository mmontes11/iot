import httpStatus from "http-status";
import chai from "./lib/chai";
import { UserModel } from "../src/models/user";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import constants from "./constants/auth";

const { assert, should: chaiShould } = chai;
const should = chaiShould();

describe("Auth", () => {
  beforeEach(done => {
    UserModel.remove({}, err => {
      assert(err !== undefined, "Error cleaning MongoDB for tests");
      done();
    });
  });

  describe("POST /api/auth/user 401", () => {
    it("tries to create a user with invalid credentials", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.invalidAuthHeader)
        .send(constants.validUser)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.UNAUTHORIZED);
          done();
        });
    });
  });

  describe("POST /api/auth/user 400", () => {
    it("tries to create an invalid user", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.invalidUser)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidUserKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
    it("tries to create a user with weak password", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.userWithWeakPassword)
        .end((err, res) => {
          should.exist(err);
          should.exist(res.body[responseKeys.invalidUserKey]);
          res.should.have.status(httpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("POST /api/auth/user 409", () => {
    it("creates the same user twice", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.validUser)
        .end((err, res) => {
          res.should.have.status(httpStatus.CREATED);
          chai
            .request(server)
            .post("/api/auth/user")
            .set("Authorization", constants.validAuthHeader)
            .send(constants.validUser)
            .end((errInnerReq, resInnerReq) => {
              should.exist(errInnerReq);
              resInnerReq.should.have.status(httpStatus.CONFLICT);
              done();
            });
        });
    });
  });

  describe("POST /api/auth 401", () => {
    it("tries to check auth with a non existing user", done => {
      chai
        .request(server)
        .post("/api/auth")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.validUser)
        .end((err, res) => {
          should.exist(err);
          res.should.have.status(httpStatus.UNAUTHORIZED);
          done();
        });
    });
  });

  describe("POST /api/auth/token 200", () => {
    it("creates a user and checks auth", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.validUser)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          chai
            .request(server)
            .post("/api/auth")
            .send(constants.validUser)
            .end((errInnerReq, resInnerReq) => {
              should.not.exist(errInnerReq);
              resInnerReq.should.have.status(httpStatus.OK);
              done();
            });
        });
    });
  });

  describe("POST /api/auth/token 200", () => {
    it("creates a user and gets a token", done => {
      chai
        .request(server)
        .post("/api/auth/user")
        .set("Authorization", constants.validAuthHeader)
        .send(constants.validUser)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(httpStatus.CREATED);
          chai
            .request(server)
            .post("/api/auth/token")
            .send(constants.validUser)
            .end((errInnerReq, resInnerReq) => {
              should.not.exist(errInnerReq);
              resInnerReq.should.have.status(httpStatus.OK);
              done();
            });
        });
    });
  });
});
