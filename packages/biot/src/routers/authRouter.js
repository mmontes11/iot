import express from "express";
import expressBasicAuth from "express-basic-auth";
import { derivedConfig } from "common/config";
import authController from "../controllers/rest/authController";

const router = express.Router();

router.route("/token").post(expressBasicAuth({ users: derivedConfig.biotBasicAuthUsers }), authController.getToken);

export default router;
