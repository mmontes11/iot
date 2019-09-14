import _ from "underscore";
import regex from "../utils/regex";

const validUser = user =>
  !_.isUndefined(user) &&
  !_.isUndefined(user.username) &&
  !_.isUndefined(user.password) &&
  regex.passwordRegex.test(user.password);

const validObservation = observation => !_.isUndefined(observation) && !_.isUndefined(observation.type);

const validUnit = unit => !_.isUndefined(unit) && !_.isUndefined(unit.name) && !_.isUndefined(unit.symbol);

const validMeasurement = measurement =>
  validObservation(measurement) && validUnit(measurement.unit) && !_.isUndefined(measurement.value);

const validEvent = event => validObservation(event);

const validThing = thing =>
  !_.isUndefined(thing) &&
  !_.isUndefined(thing.name) &&
  !_.isUndefined(thing.geometry) &&
  !_.isUndefined(thing.topic) &&
  !_.isUndefined(thing.supportedObservationTypes);

export default {
  validUser,
  validObservation,
  validUnit,
  validMeasurement,
  validEvent,
  validThing,
};
