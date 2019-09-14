import _ from "underscore";
import googleMaps from "../lib/googleMaps";
import { logInfo, logError } from "./log";

const geocode = async address => {
  logInfo(`Geocoding address '${address}'...`);
  try {
    const response = await googleMaps.geocode({ address }).asPromise();
    logInfo(JSON.stringify(response));
    const httpStatus = response.status;
    if (httpStatus >= 400) {
      logError(`Geocoding error: HTTP ${httpStatus} status`);
      return undefined;
    }
    const firstResult = _.first(response.json.results);
    if (!_.isUndefined(firstResult)) {
      logInfo("Geocoding success");
      const { lng: longitude, lat: latitude } = firstResult.geometry.location;
      return {
        longitude,
        latitude,
      };
    }
    logInfo("Geocoding: No results");
    return undefined;
  } catch (err) {
    logError(`Geocoding error:`);
    logError(err);
    throw err;
  }
};

export default { geocode };
