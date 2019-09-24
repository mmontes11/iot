import _ from "underscore";
import httpStatus from "http-status";
import Promise from "bluebird";
import modelFactory from "../../helpers/modelFactory";
import { ThingModel } from "../../models/thing";
import responseHandler from "../../helpers/responseHandler";
import constants from "../../utils/responseKeys";
import geocoder from "../../utils/geocoder";
import boolean from "../../utils/boolean";

const createOrUpdateThing = async (req, lastObservation) => {
  const thingToUpsert = modelFactory.createThing(req, lastObservation);
  await ThingModel.upsertThing(thingToUpsert);
  return thingToUpsert;
};

const getThingByName = async ({ params: { name } }, res) => {
  try {
    const thing = await ThingModel.findThingByName(name);
    responseHandler.handleResponse(res, thing);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const _getThingsFromDB = async ({
  query: { longitude: longitudeReq, latitude: latitudeReq, address, maxDistance, supportsMeasurements, supportsEvents },
}) => {
  const supportsMeasurementsBoolean = !_.isUndefined(supportsMeasurements)
    ? boolean.stringToBoolean(supportsMeasurements)
    : undefined;
  const supportsEventsBoolean = !_.isUndefined(supportsEvents) ? boolean.stringToBoolean(supportsEvents) : undefined;
  let longitude;
  let latitude;
  if (!_.isUndefined(address)) {
    const location = await geocoder.geocode(address);
    if (!_.isUndefined(location)) {
      const { longitude: longitudeLoc, latitude: latitudeLoc } = location;
      longitude = longitudeLoc;
      latitude = latitudeLoc;
    } else {
      return [];
    }
  } else {
    longitude = longitudeReq;
    latitude = latitudeReq;
  }
  try {
    return await ThingModel.findThings(
      longitude,
      latitude,
      maxDistance,
      supportsMeasurementsBoolean,
      supportsEventsBoolean,
    );
  } catch (err) {
    throw err;
  }
};

const getThings = async (req, res) => {
  try {
    const things = await _getThingsFromDB(req);
    responseHandler.handleResponse(res, things, constants.thingsArrayKey);
  } catch (err) {
    responseHandler.handleError(res, err);
  }
};

const hasRequestedThings = ({ query: { thing: thingReq, address, longitude, latitude } }) =>
  !_.isUndefined(thingReq) || !_.isUndefined(address) || (!_.isUndefined(longitude) && !_.isUndefined(latitude));

const getThingsFromRequest = async req => {
  if (!_.isUndefined(req.query.thing)) {
    return [req.query.thing];
  }
  let things;
  try {
    things = await _getThingsFromDB(req);
  } catch (err) {
    throw err;
  }
  if (!_.isUndefined(things) && !_.isEmpty(things)) {
    return _.map(_.first(things, process.env.BACK_MAX_NUM_OF_THINGS_IN_STATS_RESULTS), thing => thing.name);
  }
  return undefined;
};

const _sendThingErrorResponse = (req, res) => {
  const response = {
    [constants.invalidThingKey]: req.body.thing,
  };
  res.status(httpStatus.BAD_REQUEST).json(response);
};

const handleThingCreationError = async (req, res, createdObservations) => {
  if (!_.isUndefined(createdObservations) && !_.isEmpty(createdObservations)) {
    try {
      const removePromises = _.map(createdObservations, observation => observation.remove());
      await Promise.all(removePromises);
      _sendThingErrorResponse(req, res);
    } catch (err) {
      responseHandler.handleError(req, res);
    }
  } else {
    _sendThingErrorResponse(req, res);
  }
};

export default {
  createOrUpdateThing,
  getThingByName,
  getThings,
  hasRequestedThings,
  getThingsFromRequest,
  handleThingCreationError,
};
