import _ from "underscore";
import httpStatus from "http-status";
import responseHandler from "../../helpers/responseHandler";
import { CustomTimePeriod, TimePeriod } from "../../models/timePeriod";
import thingController from "./thingController";
import constants from "../../utils/responseKeys";

const _getTimePeriod = (startDate, endDate, timePeriod) => {
  if (!_.isUndefined(startDate) || !_.isUndefined(endDate)) {
    return new CustomTimePeriod(startDate, endDate);
  }
  if (!_.isUndefined(timePeriod)) {
    return new TimePeriod(timePeriod);
  }
  return undefined;
};

const getStats = async (req, res, StatsCache, getStatsFromDB) => {
  const {
    query: { type, startDate, endDate, timePeriod: timePeriodReq },
  } = req;
  const timePeriod = _getTimePeriod(startDate, endDate, timePeriodReq);
  try {
    let things;
    if (thingController.hasRequestedThings(req)) {
      things = await thingController.getThingsFromRequest(req);
      if (_.isUndefined(things)) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
    }
    const statsCache = new StatsCache(type, timePeriod, things);
    if (statsCache.cachePolicy()) {
      const statsFromCache = await statsCache.getStatsCache();
      if (!_.isNull(statsFromCache)) {
        return responseHandler.handleResponse(res, statsFromCache, constants.statsArrayKey);
      }
      const stats = await getStatsFromDB(type, timePeriod, things);
      statsCache.setStatsCache(stats);
      return responseHandler.handleResponse(res, stats, constants.statsArrayKey);
    }
    const stats = await getStatsFromDB(type, timePeriod, things);
    return responseHandler.handleResponse(res, stats, constants.statsArrayKey);
  } catch (err) {
    return responseHandler.handleError(res, err);
  }
};

export default { getStats };
