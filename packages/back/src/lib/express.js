import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import expressWinston from "express-winston";
import promBundle from "express-prom-bundle";
import winston from "./winston";
import routes from "../routers/indexRouter";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(cors());
app.use(helmet());

if (process.env.DEBUG) {
  app.use(
    expressWinston.logger({
      winstonInstance: winston,
      expressFormat: true,
      meta: true,
      colorize: true,
      ignoreRoute: req => ["health", "metrics"].some(r => req.path.includes(r)),
    }),
  );
}

app.use(
  promBundle({
    includeStatusCode: true,
    includeMethod: true,
    includePath: true,
    normalizePath: [["^/api/thing/.*", "/api/thing/#name"]],
  }),
);

app.use("/api", routes);

export default app;
