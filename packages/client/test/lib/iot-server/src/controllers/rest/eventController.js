import httpStatus from "http-status";
import _ from "underscore";
import { EventModel } from "../../models/event";
import { EventStatsCache } from "../../cache/statsCache";
import modelFactory from "../../helpers/modelFactory";
import responseHandler from "../../helpers/responseHandler";
import thingController from "./thingController";
import mqttController from "../mqtt/mqttController";
import statsController from "../rest/statsController";
import constants from "../../utils/responseKeys";

const createEvent = async (req, res) => {
  let newEvent;
  try {
    const event = modelFactory.createEvent(req, req.body.event);
    newEvent = await event.save();
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
  let thing;
  try {
    thing = await thingController.createOrUpdateThing(req, newEvent.phenomenonTime);
  } catch (err) {
    return thingController.handleThingCreationError(req, res, [newEvent]);
  }
  await mqttController.publishEvent(thing, newEvent);
  return res.status(httpStatus.CREATED).json(newEvent);
};

const getTypes = async (req, res) => {
  try {
    const types = await EventModel.types();
    responseHandler.handleResponse(res, types, constants.typesArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getLastEvent = async ({ query: { type, thing } }, res) => {
  try {
    const lastEvents = await EventModel.findLastN(1, type, thing);
    responseHandler.handleResponse(res, _.first(lastEvents));
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const _getStatsFromDB = async (type, timePeriod, things) => {
  try {
    return await EventModel.getStats(type, timePeriod, things);
  } catch (err) {
    throw err;
  }
};

const getStats = (req, res) => statsController.getStats(req, res, EventStatsCache, _getStatsFromDB);

export default { createEvent, getTypes, getLastEvent, getStats };
