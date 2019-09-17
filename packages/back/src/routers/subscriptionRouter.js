import express from "express";
import expressJwt from "express-jwt";
import config from "../config";
import validationController from "../controllers/rest/validationController";
import subscriptionController from "../controllers/rest/subscriptionController";

const router = express.Router();

router.route("*").all(expressJwt({ secret: config.jwtSecret }));

router.route("/").post(validationController.validateCreateSubscription, subscriptionController.createSubscription);

router.route("/:id").delete(validationController.validateDeleteSubscription, subscriptionController.deleteSubscription);

export default router;
