import express from "express";
import expressJwt from "express-jwt";

const getRouterWithJwtAuth = () => {
  const router = express.Router();
  router.route("*").all(expressJwt({ secret: process.env.JWT_SECRET }));
  return router;
};

export { getRouterWithJwtAuth };
