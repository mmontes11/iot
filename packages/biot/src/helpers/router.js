import express from "express";
import expressJwt from "express-jwt";

export const getRouterWithJwtAuth = () => {
  const router = express.Router();
  router.route("*").all(expressJwt({ secret: process.env.BIOT_JWT_SECRET }));
  return router;
};
