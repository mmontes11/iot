import _ from "underscore";
import httpStatus from "http-status";
import Promise from "bluebird";
import constants from "../../utils/responseKeys";
import modelFactory from "../../helpers/modelFactory";
import thingController from "./thingController";
import mqttController from "../mqtt/mqttController";

const _createOrUpdateThing = async (req, createdObservations) => {
  const latestObservation = _.max(createdObservations, observation => observation.phenomenonTime);
  return thingController.createOrUpdateThing(req, latestObservation.phenomenonTime);
};

const _handleResponse = (res, createdObservations, invalidObservations) => {
  if (_.isEmpty(createdObservations)) {
    const response = {
      [constants.invalidObservationsArrayKey]: invalidObservations,
    };
    return res.status(httpStatus.BAD_REQUEST).json(response);
  } else if (_.isEmpty(invalidObservations)) {
    const response = {
      [constants.createdObservationsArrayKey]: createdObservations,
    };
    return res.status(httpStatus.CREATED).json(response);
  }
  const response = {
    [constants.createdObservationsArrayKey]: createdObservations,
    [constants.invalidObservationsArrayKey]: invalidObservations,
  };
  return res.status(httpStatus.MULTI_STATUS).json(response);
};

const createObservations = async (req, res) => {
  const observations = req.body[constants.observationsArrayKey];
  const createdObservations = [];
  const invalidObservations = [];
  const savePromises = [];
  _.forEach(observations, observation => {
    try {
      const newObservation = modelFactory.createObservationUsingKind(req, observation);
      savePromises.push(newObservation.save().reflect());
    } catch (err) {
      invalidObservations.push(observation);
    }
  });
  await Promise.all(savePromises).each((inspection, index) => {
    if (inspection.isFulfilled()) {
      createdObservations.push(inspection.value());
    } else {
      invalidObservations.push(observations[index]);
    }
  });
  let thing;
  try {
    if (!_.isEmpty(createdObservations)) {
      thing = await _createOrUpdateThing(req, createdObservations);
    }
  } catch (err) {
    return thingController.handleThingCreationError(req, res, createdObservations);
  }
  await mqttController.publishObservations(thing, createdObservations);
  return _handleResponse(res, createdObservations, invalidObservations);
};

export default { createObservations };
