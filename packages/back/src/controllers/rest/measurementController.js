import _ from "underscore";
import httpStatus from "http-status";
import { MeasurementModel } from "../../models/measurement";
import modelFactory from "../../helpers/modelFactory";
import { MeasurementStatsCache } from "../../cache/statsCache";
import responseHandler from "../../helpers/responseHandler";
import thingController from "./thingController";
import mqttController from "../mqtt/mqttController";
import statsController from "../rest/statsController";
import dataController from "../rest/dataController";
import constants from "../../utils/responseKeys";

const createMeasurement = async (req, res) => {
  let newMeasurement;
  try {
    const measurement = modelFactory.createMeasurement(req, req.body.measurement);
    newMeasurement = await measurement.save();
  } catch (err) {
    responseHandler.handleError(res, err);
  }
  let thing;
  try {
    thing = await thingController.createOrUpdateThing(req, newMeasurement.phenomenonTime);
  } catch (err) {
    await thingController.handleThingCreationError(req, res, [newMeasurement]);
  }
  await mqttController.publishMeasurement(thing, newMeasurement);
  return res.sendStatus(httpStatus.CREATED);
};

const getTypes = async (req, res) => {
  try {
    const types = await MeasurementModel.types();
    responseHandler.handleResponse(res, types, constants.typesArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const getLastMeasurement = async ({ query: { type, thing } }, res) => {
  try {
    const lastMeasurements = await MeasurementModel.findLastN(1, type, thing);
    responseHandler.handleResponse(res, _.first(lastMeasurements));
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const _getStatsFromDB = async (type, timePeriod, things) => MeasurementModel.getStats(type, timePeriod, things);

const getStats = async (req, res) => statsController.getStats(req, res, MeasurementStatsCache, _getStatsFromDB);

const _getDataFromDB = async (groupBy, type, timePeriod, things) =>
  MeasurementModel.getData(groupBy, type, timePeriod, things);

const _getThingsFromDB = async (type, timePeriod) => {
  try {
    const result = await MeasurementModel.getThings(type, timePeriod);
    return result.map(item => item.thing);
  } catch (err) {
    throw err;
  }
};

const getData = async (req, res) => dataController.getData(req, res, _getDataFromDB, _getThingsFromDB);

export default {
  createMeasurement,
  getTypes,
  getLastMeasurement,
  getStats,
  getData,
};
