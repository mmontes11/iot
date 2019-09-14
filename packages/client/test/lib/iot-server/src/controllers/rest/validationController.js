import _ from "underscore";
import httpStatus from "http-status";
import { TimePeriod, CustomTimePeriod } from "../../models/timePeriod";
import requestValidator from "../../helpers/requestValidator";
import boolean from "../../utils/boolean";
import responseKeys from "../../utils/responseKeys";
import regex from "../../utils/regex";

const validateCreateUserIfNotExists = (req, res, next) => {
  const user = req.body;
  if (!requestValidator.validUser(user)) {
    res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidUserKey]: user });
  } else {
    next();
  }
};

const validateCreateMeasurement = ({ body: { measurement, thing } }, res, next) => {
  if (!requestValidator.validMeasurement(measurement)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidMeasurementKey]: measurement });
  }
  if (!requestValidator.validThing(thing)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidThingKey]: thing });
  }
  return next();
};

const validateCreateEvent = ({ body: { event, thing } }, res, next) => {
  if (!requestValidator.validEvent(event)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidEventKey]: event });
  }
  if (!requestValidator.validThing(thing)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidThingKey]: thing });
  }
  return next();
};

const _validCoordinateParams = (longitude, latitude) =>
  (_.isUndefined(longitude) && _.isUndefined(latitude)) || (!_.isUndefined(longitude) && !_.isUndefined(latitude));

const validateTimePeriod = timePeriodReq => {
  if (!_.isUndefined(timePeriodReq)) {
    const timePeriod = new TimePeriod(timePeriodReq);
    return timePeriod.isValid();
  }
  return true;
};

const validateCommonParams = (
  { query: { startDate, endDate, timePeriod: timePeriodReq, longitude, latitude } },
  res,
  next,
) => {
  if (!_.isUndefined(startDate) || !_.isUndefined(endDate)) {
    const customTimePeriod = new CustomTimePeriod(startDate, endDate);
    if (!customTimePeriod.isValid()) {
      const responseBody = {
        [responseKeys.invalidDateRangeKey]: {
          [responseKeys.startDateKey]: startDate,
          [responseKeys.endDateKey]: endDate,
        },
      };
      return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidDateRangeKey]: responseBody });
    }
  }
  if (!validateTimePeriod(timePeriodReq)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidTimePeriod]: timePeriodReq });
  }
  if (!_validCoordinateParams(longitude, latitude)) {
    const responseBody = {
      [responseKeys.invalidCoordinateParamsKey]: {
        [responseKeys.longitudeKey]: longitude,
        [responseKeys.latitudeKey]: latitude,
      },
    };
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidCoordinateParamsKey]: responseBody });
  }
  return next();
};

const validateGetMeasurementData = ({ query: { groupBy: groupByReq } }, res, next) => {
  if (!validateTimePeriod(groupByReq)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidTimePeriod]: groupByReq });
  }
  return next();
};

const validateCreateObservations = ({ body: { observations, thing } }, res, next) => {
  if (_.isUndefined(observations) || !_.isArray(observations)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidObservationsArrayKey]: observations });
  }
  if (_.isEmpty(observations)) {
    return res.sendStatus(httpStatus.NOT_MODIFIED);
  }
  if (!requestValidator.validThing(thing)) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidThingKey]: thing });
  }
  return next();
};

const validateGetThings = ({ query: { latitude, longitude, supportsMeasurements, supportsEvents } }, res, next) => {
  if (!_validCoordinateParams(longitude, latitude)) {
    const responseBody = {
      [responseKeys.invalidCoordinateParamsKey]: {
        [responseKeys.longitudeKey]: longitude,
        [responseKeys.latitudeKey]: latitude,
      },
    };
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidCoordinateParamsKey]: responseBody });
  }
  if (!_.isUndefined(supportsMeasurements) && !boolean.stringIsBoolean(supportsMeasurements)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      [responseKeys.invalidQueryParamKey]: responseKeys.supportsMeasurementsKey,
    });
  }
  if (!_.isUndefined(supportsEvents) && !boolean.stringIsBoolean(supportsEvents)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      [responseKeys.invalidQueryParamKey]: responseKeys.supportsEventsKey,
    });
  }
  return next();
};

const validateCreateSubscription = (req, res, next) => {
  const subscription = req.body;
  const invalidTopicId = _.isUndefined(subscription.topicId) || !regex.objectId.test(subscription.topicId);
  if (
    _.isUndefined(subscription) ||
    _.isUndefined(subscription.chatId) ||
    (_.isUndefined(subscription.topic) && invalidTopicId)
  ) {
    return res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidSubscriptionKey]: subscription });
  }
  return next();
};

const validateDeleteSubscription = (req, res, next) => {
  const subscriptionId = req.params.id;
  if (!regex.objectId.test(subscriptionId)) {
    res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidPathParamKey]: subscriptionId });
  } else {
    next();
  }
};

const validateGetSubscriptionsByChat = ({ query: { chatId } }, res, next) => {
  if (_.isUndefined(chatId)) {
    res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.mandatoryQueryParamKey]: responseKeys.chatIdKey });
  } else if (_.isNaN(parseInt(chatId, 10))) {
    res.status(httpStatus.BAD_REQUEST).json({ [responseKeys.invalidQueryParamKey]: chatId });
  } else {
    next();
  }
};

export default {
  validateCreateUserIfNotExists,
  validateCreateMeasurement,
  validateCreateEvent,
  validateCommonParams,
  validateGetMeasurementData,
  validateCreateObservations,
  validateGetThings,
  validateCreateSubscription,
  validateDeleteSubscription,
  validateGetSubscriptionsByChat,
};
