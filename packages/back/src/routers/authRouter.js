import express from "express";
import expressBasicAuth from "express-basic-auth";
import { derivedConfig } from "common/config";
import authController from "../controllers/rest/authController";
import validationController from "../controllers/rest/validationController";

const router = express.Router();

router.route("/").post(validationController.validateCheckAuth, authController.checkAuth);

router
  .route("/user")
  .post(
    expressBasicAuth({ users: derivedConfig.backBasicAuthUsers }),
    validationController.validateCreateUserIfNotExists,
    authController.createUserIfNotExists,
  );

router.route("/token").post(authController.getToken);

export default router;
