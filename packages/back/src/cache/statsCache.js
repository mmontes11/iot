import _ from "underscore";
import cacheHandler from "./cacheHandler";
import { CustomTimePeriod } from "../models/timePeriod";

const statsPrefix = "stats";

class StatsCache {
  constructor(prefix, type, timePeriod, things) {
    this.timePeriod = timePeriod;
    this.cacheKey = StatsCache._getStatsCacheKey(prefix, type, timePeriod, things);
  }
  cachePolicy() {
    return _.isUndefined(this.timePeriod) || !(this.timePeriod instanceof CustomTimePeriod);
  }
  setStatsCache(stats) {
    cacheHandler.setObjectCache(this.cacheKey, stats, process.env.BACK_STATS_CACHE_IN_SECONDS);
  }
  getStatsCache() {
    return cacheHandler.getObjectCache(this.cacheKey);
  }
  static _getStatsCacheKey(prefix, type, timePeriod, things) {
    const elementsCacheKey = [];
    if (!_.isUndefined(type)) {
      elementsCacheKey.push(type);
    }
    if (!_.isUndefined(timePeriod) && timePeriod.isValid()) {
      elementsCacheKey.push(timePeriod.name);
    }
    if (!_.isUndefined(things) && !_.isEmpty(things)) {
      elementsCacheKey.push(...things);
    }
    return _.reduce(elementsCacheKey, (memo, keyPart) => memo.concat(`_${keyPart}`), prefix);
  }
}

class EventStatsCache extends StatsCache {
  constructor(type, timePeriod, things) {
    super(`event_${statsPrefix}`, type, timePeriod, things);
  }
}

class MeasurementStatsCache extends StatsCache {
  constructor(type, timePeriod, things) {
    super(`measurement_${statsPrefix}`, type, timePeriod, things);
  }
}

export { EventStatsCache, MeasurementStatsCache };
