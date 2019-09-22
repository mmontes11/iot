import _ from "underscore";
import httpStatus from "http-status";
import { CustomTimePeriod, TimePeriod } from "../../models/timePeriod";
import responseHandler from "../../helpers/responseHandler";
import thingController from "./thingController";
import constants from "../../utils/responseKeys";

const getData = async (req, res, getDataFromDB, getThingsFromDB) => {
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
    const data = await getDataFromDB(groupByTimePeriod, type, timePeriod, things);
    if (_.isEmpty(data)) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (!things) {
      things = await getThingsFromDB(type, timePeriod);
    }
    const response = {
      [constants.dataArayKey]: data,
      [constants.thingsArrayKey]: things,
    };
    return responseHandler.handleResponse(res, response);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default { getData };
