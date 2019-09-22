import _ from "underscore";
import { buildMatch } from "../helpers/aggregationHelper";

export default {
  username: String,
  thing: {
    type: String,
    required: true,
  },
  phenomenonTime: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: String,
    required: true,
  },
};

export const types = model => model.distinct("type");

export const findLastN = (model, n = 10, type, thing) => {
  let findCriteria = {};
  if (!_.isUndefined(type)) {
    findCriteria = { type };
  }
  if (!_.isUndefined(thing)) {
    findCriteria = { ...findCriteria, thing };
  }
  return model
    .find(findCriteria)
    .sort({ phenomenonTime: -1 })
    .limit(n);
};

export const getThings = (model, type, timePeriod) => {
  const match = buildMatch(type, timePeriod);
  const pipeline = [
    {
      $group: {
        _id: {
          thing: "$thing",
        },
      },
    },
    {
      $project: {
        _id: 0,
        thing: "$_id.thing",
      },
    },
    {
      $sort: {
        thing: 1,
      },
    },
  ];
  return model.aggregate([...match, ...pipeline]);
};
