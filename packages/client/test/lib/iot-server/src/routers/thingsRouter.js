import express from "express";
import expressJwt from "express-jwt";
import config from "../config/index";
import validationController from "../controllers/rest/validationController";
import thingController from "../controllers/rest/thingController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router.route("/").get(validationController.validateGetThings, thingController.getThings);

export default router;
