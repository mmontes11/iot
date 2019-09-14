import _ from "underscore";

const latLangFromGeometry = geometry => {
  if (_.isEqual(geometry.type, "Point") && !_.isUndefined(geometry.coordinates) && _.size(geometry.coordinates) === 2) {
    return {
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };
  }
  return undefined;
};

export default { latLangFromGeometry };
