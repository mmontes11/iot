import mongoose from "../lib/mongoose";
import observation, * as observationHelpers from "./observation";
import { UnitSchema } from "./unit";
import { buildMatch, buildDateHelpers } from "../helpers/aggregationHelper";

const MeasurementSchema = new mongoose.Schema({
  ...observation,
  unit: {
    type: UnitSchema,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

MeasurementSchema.statics.types = function types() {
  return observationHelpers.types(this);
};

MeasurementSchema.statics.findLastN = function findLastN(n = 10, type, thing) {
  return observationHelpers.findLastN(this, n, type, thing);
};

MeasurementSchema.statics.getThings = function getThings(type, timePeriod) {
  return observationHelpers.getThings(this, type, timePeriod);
};

MeasurementSchema.statics.getStats = function getStats(type, timePeriod, things) {
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        value: 1,
        type: 1,
        thing: 1,
        unitName: "$unit.name",
        unitSymbol: "$unit.symbol",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          unit: {
            name: "$unitName",
            symbol: "$unitSymbol",
          },
        },
        avg: {
          $avg: "$value",
        },
        max: {
          $max: "$value",
        },
        min: {
          $min: "$value",
        },
        stdDev: {
          $stdDevPop: "$value",
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        unit: "$_id.unit",
        thing: "$_id.thing",
        avg: "$avg",
        max: "$max",
        min: "$min",
        stdDev: "$stdDev",
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          unit: "$unit",
        },
        data: {
          $push: {
            thing: "$thing",
            avg: "$avg",
            max: "$max",
            min: "$min",
            stdDev: "$stdDev",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        unit: "$_id.unit",
        data: 1,
      },
    },
  ];
  return this.aggregate([...match, ...pipeline]);
};

MeasurementSchema.statics.getData = function getData(groupBy, type, timePeriod, things) {
  const { dateToParts, dateFromParts } = buildDateHelpers(groupBy);
  const match = buildMatch(type, timePeriod, things);
  const pipeline = [
    {
      $project: {
        _id: 0,
        value: 1,
        type: 1,
        thing: 1,
        unit: {
          name: "$unit.name",
          symbol: "$unit.symbol",
        },
        date: dateToParts,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          thing: "$thing",
          unit: "$unit",
          date: "$date",
        },
        value: {
          $avg: "$value",
        },
      },
    },
    {
      $project: {
        type: "$_id.type",
        thing: "$_id.thing",
        unit: "$_id.unit",
        phenomenonTime: dateFromParts,
        value: 1,
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          unit: "$unit",
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
          unit: "$_id.unit",
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
        unit: "$_id.unit",
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

const MeasurementModel = mongoose.model("Measurement", MeasurementSchema);

export { MeasurementSchema, MeasurementModel };
