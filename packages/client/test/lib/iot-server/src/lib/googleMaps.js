import googleMaps from "@google/maps";
import config from "../config/index";

const googleMapsClient = googleMaps.createClient({
  key: config.googleMapsKey,
  Promise,
});

export default googleMapsClient;
