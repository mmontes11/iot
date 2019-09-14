import _ from "underscore";
import httpStatus from "http-status";
import { MeasurementModel } from "../../models/measurement";
import modelFactory from "../../helpers/modelFactory";
import { MeasurementStatsCache } from "../../cache/statsCache";
import { CustomTimePeriod, TimePeriod } from "../../models/timePeriod";
import responseHandler from "../../helpers/responseHandler";
import thingController from "./thingController";
import mqttController from "../mqtt/mqttController";
import statsController from "../rest/statsController";
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
  res.status(httpStatus.CREATED).json(newMeasurement);
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

const _getStatsFromDB = async (type, timePeriod, things) => {
  try {
    return await MeasurementModel.getStats(type, timePeriod, things);
  } catch (err) {
    throw err;
  }
};

const getStats = async (req, res) => statsController.getStats(req, res, MeasurementStatsCache, _getStatsFromDB);

const getData = async (req, res) => {
  const {
    query: { groupBy: groupByReq, type, startDate, endDate, timePeriod: timePeriodReq },
  } = req;
  let groupByTimePeriod;
  if (!_.isUndefined(groupByReq)) {
    groupByTimePeriod = new TimePeriod(groupByReq);
  }
  let timePeriod;
  if (!_.isUndefined(startDate) || !_.isUndefined(endDate)) {
    timePeriod = new CustomTimePeriod(startDate, endDate);
  }
  if (!_.isUndefined(timePeriodReq)) {
    timePeriod = new TimePeriod(timePeriodReq);
  }
  let things;
  try {
    if (thingController.hasRequestedThings(req)) {
      things = await thingController.getThingsFromRequest(req);
      if (_.isUndefined(things)) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
    }
    const measurementData = await MeasurementModel.getData(groupByTimePeriod, type, timePeriod, things);
    if (_.isUndefined(things)) {
      things = (await MeasurementModel.getThings(type, timePeriod)).map(result => result.thing);
    }
    if (_.isEmpty(measurementData) || _.isEmpty(things)) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const response = {
      measurementData,
      things,
    };
    return responseHandler.handleResponse(res, response);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default {
  createMeasurement,
  getTypes,
  getLastMeasurement,
  getStats,
  getData,
};
