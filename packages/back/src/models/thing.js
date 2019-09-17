import _ from "underscore";
import mongoose from "../lib/mongoose";
import config from "../config";
import regex from "../utils/regex";

const SupportedObservationTypesSchema = new mongoose.Schema({
  measurement: {
    type: [String],
    required: false,
  },
  event: {
    type: [String],
    required: false,
  },
});

const ThingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  ip: {
    type: String,
    required: true,
    match: regex.ipRegex,
  },
  geometry: {
    type: mongoose.Schema.Types.GeoJSON,
    required: true,
    index: "2dsphere",
  },
  googleMapsUrl: {
    type: String,
    required: true,
  },
  lastObservation: {
    type: Date,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  supportedObservationTypes: {
    type: SupportedObservationTypesSchema,
    required: true,
  },
});

ThingSchema.statics.upsertThing = function upsertThing(thing) {
  return this.update({ name: thing.name }, thing, { upsert: true });
};

ThingSchema.statics.findThingByName = function findThingByName(name) {
  return this.findOne({ name });
};

ThingSchema.statics.findThings = function findThings(
  longitude,
  latitude,
  maxDistance = config.maxDefaultNearbyDistanceInMeters,
  supportsMeasurements,
  supportsEvents,
) {
  const query = {};
  if (!_.isUndefined(longitude) && !_.isUndefined(latitude)) {
    query.geometry = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    };
  }
  if (!_.isUndefined(supportsMeasurements)) {
    query["supportedObservationTypes.measurement"] = supportsMeasurements ? { $ne: [] } : { $eq: [] };
  }
  if (!_.isUndefined(supportsEvents)) {
    query["supportedObservationTypes.event"] = supportsEvents ? { $ne: [] } : { $eq: [] };
  }
  return this.find(query);
};

const ThingModel = mongoose.model("Thing", ThingSchema);

export { ThingSchema, ThingModel };
