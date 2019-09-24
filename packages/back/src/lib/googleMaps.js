import googleMaps from "@google/maps";

const googleMapsClient = googleMaps.createClient({
  key: process.env.GOOGLE_MAPS_KEY,
  Promise,
});

export default googleMapsClient;
