import express from "express";
import expressJwt from "express-jwt";
import config from "../config/index";
import thingController from "../controllers/rest/thingController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router.route("/:name").get(thingController.getThingByName);

export default router;
