import mongoose from "../lib/mongoose";
import observation, * as observationHelpers from "./observation";
import { buildMatch, buildDateHelpers } from "../helpers/aggregationHelper";

const EventSchema = new mongoose.Schema({
  ...observation,
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
});

EventSchema.statics.types = function types() {
  return observationHelpers.types(this);
};

EventSchema.statics.findLastN = function findLastN(n = 10, type, thing) {
  return observationHelpers.findLastN(this, n, type, thing);
};

EventSchema.statics.getThings = function getThings(type, timePeriod) {
  return observationHelpers.getThings(this, type, timePeriod);
};

EventSchema.statics.getStats = function getStats(type, timePeriod, things) {
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        type: 1,
        thing: 1,
        hour: { $hour: "$phenomenonTime" },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          hour: "$hour",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        thing: "$_id.thing",
        hour: "$_id.hour",
        count: "$count",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
        },
        total: {
          $sum: "$count",
        },
        avgByHour: {
          $avg: "$count",
        },
        maxByHour: {
          $max: "$count",
        },
        minByHour: {
          $min: "$count",
        },
        stdDevByHour: {
          $stdDevPop: "$count",
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        thing: "$_id.thing",
        total: "$total",
        avgByHour: "$avgByHour",
        maxByHour: "$maxByHour",
        minByHour: "$minByHour",
        stdDevByHour: "$stdDevByHour",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
        },
        data: {
          $push: {
            thing: "$thing",
            total: "$total",
            avgByHour: "$avgByHour",
            maxByHour: "$maxByHour",
            minByHour: "$minByHour",
            stdDevByHour: "$stdDevByHour",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        data: 1,
      },
    },
    {
      $sort: {
        type: 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};

EventSchema.statics.getData = function getData(groupBy, type, timePeriod, things) {
  const { dateToParts, dateFromParts } = buildDateHelpers(groupBy);
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        type: 1,
        thing: 1,
        date: dateToParts,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          date: "$date",
        },
        value: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        type: "$_id.type",
        thing: "$_id.thing",
        phenomenonTime: dateFromParts,
        value: 1,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          phenomenonTime: "$phenomenonTime",
        },
        values: {
          $push: {
            thing: "$thing",
            value: "$value",
          },
        },
      },
    },
    {
      $sort: {
        "_id.phenomenonTime": 1,
      },
    },
    {
      $group: {
        _id: {
          type: "$_id.type",
        },
        items: {
          $push: {
            values: "$values",
            phenomenonTime: "$_id.phenomenonTime",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        items: 1,
      },
    },
    {
      $sort: {
        type: 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};

const EventModel = mongoose.model("Event", EventSchema);

export { EventSchema, EventModel };
