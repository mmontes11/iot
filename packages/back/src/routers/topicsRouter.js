import express from "express";
import expressJwt from "express-jwt";
import config from "../config";
import topicsController from "../controllers/rest/topicsController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router.route("/").get(topicsController.getTopics);

export default router;
