import express from "express";
import expressBasicAuth from "express-basic-auth";
import authController from "../controllers/rest/authController";
import config from "../config/index";

const router = express.Router();

router.route("/token").post(expressBasicAuth({ users: config.biotBasicAuthUsers }), authController.getToken);

export default router;
