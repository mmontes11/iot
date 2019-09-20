import express from "express";
import expressJwt from "express-jwt";
import validationController from "../controllers/rest/validationController";
import notificationsController from "../controllers/rest/notificationsController";
import config from "../config";

const router = express.Router();

router
  .route("/notifications")
  .post(
    expressJwt({ secret: config.biotJwtSecret }),
    validationController.validateNotifications,
    notificationsController.receiveEventNotifications,
  );

export default router;
