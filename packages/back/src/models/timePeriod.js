import moment from "moment";
import _ from "underscore";

export const second = "second";
export const minute = "minute";
export const hour = "hour";
export const day = "day";
export const week = "week";
export const month = "month";
export const year = "year";
export const orderedTimePeriods = [second, minute, hour, day, week, month, year];
const dateFormats = [moment.ISO_8601, "YYYY-MM-DD"];

export class TimePeriod {
  constructor(timePeriodString) {
    if (!_.isUndefined(timePeriodString)) {
      this.name = TimePeriod._normalizeTimePeriod(timePeriodString);
      this.startDate = moment()
        .utc()
        .subtract(1, this.name);
    }
    this.endDate = moment().utc();
  }
  static _normalizeTimePeriod(timePeriodString) {
    if (orderedTimePeriods.includes(timePeriodString)) {
      return timePeriodString;
    }
    return undefined;
  }
  isValid() {
    return !_.isUndefined(this.name);
  }
}

export class CustomTimePeriod {
  constructor(startDate, endDate) {
    if (!_.isUndefined(startDate)) {
      this.startDate = moment(startDate, dateFormats).utc();
    }
    if (!_.isUndefined(endDate)) {
      this.endDate = moment(endDate, dateFormats).utc();
    }
  }
  isValid() {
    if (!_.isUndefined(this.startDate) || !_.isUndefined(this.endDate)) {
      if (!_.isUndefined(this.startDate) && !_.isUndefined(this.endDate)) {
        return this.endDate.isAfter(this.startDate);
      }
      return true;
    }
    return false;
  }
}
