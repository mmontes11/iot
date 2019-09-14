import _ from "underscore";
import httpStatus from "http-status";

const validateNotifications = (req, res, next) => {
  const {
    body: { notifications },
  } = req;
  if (!_.isArray(notifications)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  if (_.isEmpty(notifications)) {
    return res.sendStatus(httpStatus.NOT_MODIFIED);
  }
  return next();
};

export default { validateNotifications };
