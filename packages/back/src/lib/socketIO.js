import SocketIO from "socket.io";
import jwt from "jsonwebtoken";
import _ from "underscore";
import config from "../config";
import { logError } from "../utils/log";
import { ThingModel } from "../models/thing";

export const setupSocketIO = server => {
  const io = new SocketIO(server);
  io.use(async (socket, next) => {
    const {
      handshake: {
        query: { token, thing: thingName, type },
      },
    } = socket;
    if (_.isUndefined(token)) {
      const tokenError = new Error("No token provided");
      logError(tokenError);
      return next(tokenError);
    }
    try {
      if (jwt.verify(token, config.jwtSecret)) {
        if (_.isUndefined(thingName)) {
          const thingError = new Error("No thing provided");
          logError(thingError);
          return next(thingError);
        }
        const thing = await ThingModel.findThingByName(thingName);
        if (_.isUndefined(thing) || _.isNull(thing)) {
          const thingNotFoundError = new Error("Thing not found");
          logError(thingNotFoundError);
          return next(thingNotFoundError);
        }
        socket.token = token;
        socket.thing = thing;
        socket.type = type;
        return next();
      }
      const authError = new Error("Auth error");
      logError(logError);
      return next(authError);
    } catch (err) {
      logError(err);
      return next(err);
    }
  });
  return io;
};
