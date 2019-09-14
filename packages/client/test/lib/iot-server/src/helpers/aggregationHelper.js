import _ from "underscore";
import { week, orderedTimePeriods } from "../models/timePeriod";

export const buildMatch = (type, timePeriod, things) => {
  const match = [];
  const matchConditions = [];
  if (!_.isUndefined(type)) {
    matchConditions.push({
      type,
    });
  }
  if (!_.isUndefined(timePeriod)) {
    if (!_.isUndefined(timePeriod.startDate)) {
      matchConditions.push({
        phenomenonTime: {
          $gte: timePeriod.startDate.toDate(),
        },
      });
    }
    if (!_.isUndefined(timePeriod.endDate)) {
      matchConditions.push({
        phenomenonTime: {
          $lte: timePeriod.endDate.toDate(),
        },
      });
    }
  }
  if (!_.isUndefined(things) && !_.isEmpty(things)) {
    const thingsConditions = _.map(things, thing => ({ thing: { $eq: thing } }));
    matchConditions.push({
      $or: thingsConditions,
    });
  }
  if (!_.isEmpty(matchConditions)) {
    match.push({
      $match: {
        $and: matchConditions,
      },
    });
  }
  return match;
};

export const buildDateHelpers = timePeriod => {
  const timePeriodName = timePeriod && timePeriod.name;
  const project = {
    second: { $second: "$phenomenonTime" },
    minute: { $minute: "$phenomenonTime" },
    hour: { $hour: "$phenomenonTime" },
    day: { $dayOfMonth: "$phenomenonTime" },
    week: { $isoWeek: "$phenomenonTime" },
    month: { $month: "$phenomenonTime" },
    year: { $year: "$phenomenonTime" },
  };
  const group = {
    second: "$_id.date.second",
    minute: "$_id.date.minute",
    hour: "$_id.date.hour",
    day: "$_id.date.day",
    month: "$_id.date.month",
    year: "$_id.date.year",
  };
  const index = orderedTimePeriods.indexOf(timePeriodName);
  let currentProject;
  if (index !== -1) {
    const tmpProject = {};
    for (let i = index; i < orderedTimePeriods.length; i += 1) {
      const matchedTimePeriod = orderedTimePeriods[i];
      tmpProject[matchedTimePeriod] = project[matchedTimePeriod];
    }
    currentProject = tmpProject;
  } else {
    currentProject = project;
  }
  const groupKeys = Object.keys(currentProject).filter(key => key !== week);
  const currentGroup = {};
  groupKeys.forEach(key => {
    currentGroup[key] = group[key];
  });
  return {
    dateToParts: currentProject,
    dateFromParts: {
      $dateFromParts: currentGroup,
    },
  };
};
