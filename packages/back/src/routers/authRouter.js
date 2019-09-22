import express from "express";
import expressBasicAuth from "express-basic-auth";
import authController from "../controllers/rest/authController";
import validationController from "../controllers/rest/validationController";
import config from "../config";

const router = express.Router();

router.route("*").all(expressBasicAuth({ users: config.basicAuthUsers }));

router.route("/").post(validationController.validateCheckAuth, authController.checkAuth);

router.route("/user").post(validationController.validateCreateUserIfNotExists, authController.createUserIfNotExists);

router.route("/token").post(authController.getToken);

export default router;
