import httpStatus from "http-status";
import chai from "./lib/chai";
import server from "../src/index";
import responseKeys from "../src/utils/responseKeys";
import authConstants from "./constants/auth";

const { assert, should: chaiShould } = chai;
const should = chaiShould();
let token = null;
const auth = () => `Bearer ${token}`;

describe("TimePeriod", () => {
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

  describe("GET /timePeriods 200", () => {
    it("gets all time periods", done => {
      chai
        .request(server)
        .get("/timePeriods")
        .set("Authorization", auth())
        .end((errInneReq, res) => {
          should.not.exist(errInneReq);
          res.should.have.status(httpStatus.OK);
          should.exist(res.body[responseKeys.timePeriodsArrayKey]);
          done();
        });
    });
  });
});
