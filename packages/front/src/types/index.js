import { shape, string, arrayOf, bool } from "prop-types";

export const thingShape = shape({
  name: string,
  ip: string,
  lastObservation: string,
  geometry: shape({}),
  googleMapsUrl: string,
  supportedObservationTypes: shape({
    event: arrayOf(string),
    measurement: arrayOf(string),
  }),
});

export const paramShape = shape({
  selectedItem: string,
  items: arrayOf(string),
  isActive: bool,
  isLoading: bool,
  isDisabled: bool,
});

export const dateFilterShape = shape({
  timePeriod: paramShape,
  custom: shape({
    startDate: string,
    endDate: string,
  }),
});
