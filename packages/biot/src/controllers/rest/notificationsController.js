import httpStatus from "http-status";
import _ from "underscore";
import log from "../../utils/log";
import requestValidator from "../../helpers/requestValidator";
import telegramBotController from "../bot/telegramBotController";

const _sendNotifications = async (req, res, isValidNotification, handleNotifications) => {
  const {
    body: { notifications },
  } = req;
  const validNotifications = [];
  const invalidNotifications = [];
  _.forEach(notifications, notification => {
    if (isValidNotification(notification)) {
      validNotifications.push(notification);
    } else {
      invalidNotifications.push(notification);
    }
  });
  if (_.isEmpty(validNotifications)) {
    return res.status(httpStatus.BAD_REQUEST).json({ invalidNotifications });
  }
  const handledNotifications = await handleNotifications(notifications);
  if (_.isEmpty(invalidNotifications) && _.isEmpty(handledNotifications.erroredNotifications)) {
    return res.status(httpStatus.OK).json({
      sentNotifications: handledNotifications.sentNotifications,
    });
  }
  return res.status(httpStatus.MULTI_STATUS).json({
    sentNotifications: handledNotifications.sentNotifications,
    erroredNotifications: handledNotifications.erroredNotifications,
    invalidNotifications,
  });
};

const receiveEventNotifications = async (req, res) => {
  try {
    await _sendNotifications(req, res, requestValidator.isValidObservationNotification, notifications =>
      telegramBotController.handleEventNotifications(notifications),
    );
  } catch (err) {
    log.logError(err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const receiveMeasurementNotifications = async (req, res) => {
  try {
    await _sendNotifications(req, res, requestValidator.isValidObservationNotification, notifications =>
      telegramBotController.handleMeasurementNotifications(notifications),
    );
  } catch (err) {
    log.logError(err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const receiveMeasurementChangeNotifications = async (req, res) => {
  try {
    await _sendNotifications(req, res, requestValidator.isValidMeasurementChangeNotification, notifications =>
      telegramBotController.handleMeasurementChangeNotifications(notifications),
    );
  } catch (err) {
    log.logError(err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export default { receiveEventNotifications, receiveMeasurementNotifications, receiveMeasurementChangeNotifications };
