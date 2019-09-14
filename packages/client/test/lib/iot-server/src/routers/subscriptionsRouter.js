import express from "express";
import expressJwt from "express-jwt";
import config from "../config/index";
import validationController from "../controllers/rest/validationController";
import subscriptionsController from "../controllers/rest/subscriptionsController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router
  .route("/")
  .get(validationController.validateGetSubscriptionsByChat, subscriptionsController.getSubscriptionsByChat);

export default router;
