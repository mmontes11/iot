import express from "express";
import expressBasicAuth from "express-basic-auth";
import expressJwt from "express-jwt";
import { derivedConfig } from "common/config";

const getRouterWithBasicAuth = () => {
  const router = express.Router();
  router.route("*").all(expressBasicAuth({ users: derivedConfig.backBasicAuthUsers }));
  return router;
};

const getRouterWithJwtAuth = () => {
  const router = express.Router();
  router.route("*").all(expressJwt({ secret: process.env.BACK_JWT_SECRET }));
  return router;
};

export { getRouterWithBasicAuth, getRouterWithJwtAuth };
