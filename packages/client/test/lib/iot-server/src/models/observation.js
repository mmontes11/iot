import _ from "underscore";
import mongoose from "../lib/mongoose";
import { buildMatch } from "../helpers/aggregationHelper";

const ObservationSchema = new mongoose.Schema({
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
});

ObservationSchema.statics.types = function types() {
  return this.distinct("type");
};

ObservationSchema.statics.findLastN = function findLastN(n = 10, type, thing) {
  let findCriteria = {};
  if (!_.isUndefined(type)) {
    findCriteria = Object.assign(findCriteria, { type });
  }
  if (!_.isUndefined(thing)) {
    findCriteria = Object.assign(findCriteria, { thing });
  }
  return this.find(findCriteria)
    .sort({ phenomenonTime: -1 })
    .limit(n);
};

ObservationSchema.statics.getThings = function getThings(type, timePeriod) {
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
  ];
  return this.aggregate([...match, ...pipeline]);
};

const ObservationModel = mongoose.model("Observation", ObservationSchema);

export { ObservationSchema, ObservationModel };
