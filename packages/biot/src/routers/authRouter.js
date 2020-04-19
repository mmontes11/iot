import express from "express";
import expressBasicAuth from "express-basic-auth";
import config from "../config";
import authController from "../controllers/rest/authController";

const router = express.Router();

router.route("/token").post(expressBasicAuth({ users: config.basicAuthUsers }), authController.getToken);

export default router;
