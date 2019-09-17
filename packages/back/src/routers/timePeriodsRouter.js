import express from "express";
import expressJwt from "express-jwt";
import config from "../config";
import timePeriodsController from "../controllers/rest/timePeriodsController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router.route("/").get(timePeriodsController.getTimePeriods);

export default router;
