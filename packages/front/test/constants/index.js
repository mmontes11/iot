import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { initialState as app } from "reducers/app";
import { initialState as request } from "reducers/request";
import { initialState as auth } from "reducers/auth";
import { initialState as things } from "reducers/things";
import { initialState as params } from "reducers/params";
import { initialState as filters } from "reducers/filters";
import { initialState as data } from "reducers/data";
import { initialState as localization } from "reducers/localization";

export const initialState = {
  app,
  auth,
  request,
  things,
  params,
  filters,
  data,
  localization,
};

export const defaultStore = configureStore([thunk])(initialState);

export const thing = {
  name: "foo",
  ip: "http://192.168.0.20",
  topic: "bar",
  lastObservation: "2018-08-18T10:30:04.158Z",
  supportedObservationTypes: {
    event: ["foo", "bar"],
    measurement: ["bar", "foo"],
  },
  googleMapsUrl: "https://www.google.es/maps",
  geometry: {
    coordinates: [-40.58457, 40.21339],
    type: "Point",
  },
};

export const statsWithUnits = {
  data: [
    {
      thing: "raspi",
      value: 10,
    },
    {
      thing: "raspi2",
      value: 11,
    },
    {
      thing: "raspi3",
      value: 12,
    },
  ],
  type: "measurement",
  unit: {
    symbol: "ºC",
  },
};

export const statsWithoutUnits = {
  data: [
    {
      thing: "raspi",
      value: 10,
    },
    {
      thing: "raspi2",
      value: 11,
    },
    {
      thing: "raspi3",
      value: 12,
    },
  ],
  type: "measurement2",
};

export const statsItem = {
  data: [
    {
      thing: "arduino",
      avg: 79,
      max: 79,
      min: 79,
      stdDev: 0,
    },
  ],
  type: "temperature",
  unit: {
    name: "degrees",
    symbol: "°C",
  },
};

export const eventDataItem = {
  items: [
    {
      values: [
        {
          thing: "arduino",
          value: 1200,
        },
      ],
      phenomenonTime: "2019-04-06T18:59:00.000Z",
    },
  ],
  type: "door-opened",
};

export const measurementDataItem = {
  items: [
    {
      values: [
        {
          thing: "arduino",
          value: 79,
        },
      ],
      phenomenonTime: "2019-04-06T18:59:00.000Z",
    },
  ],
  type: "temperature",
  unit: {
    name: "degrees",
    symbol: "°C",
  },
};
