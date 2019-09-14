import _ from "underscore";

const _isValidMeasurementChange = measurementChange =>
  !_.isUndefined(measurementChange.observation) && !_.isUndefined(measurementChange.growthRate);

const isValidObservationNotification = observationNotification =>
  !_.isUndefined(observationNotification) &&
  !_.isUndefined(observationNotification.topic) &&
  !_.isUndefined(observationNotification.chatId) &&
  !_.isUndefined(observationNotification.observation);

const isValidMeasurementChangeNotification = measurementChangeNotification =>
  !_.isUndefined(measurementChangeNotification) &&
  !_.isUndefined(measurementChangeNotification.topic) &&
  !_.isUndefined(measurementChangeNotification.chatId) &&
  _isValidMeasurementChange(measurementChangeNotification.measurementChange);

export default { isValidObservationNotification, isValidMeasurementChangeNotification };
