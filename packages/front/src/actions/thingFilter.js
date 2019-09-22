import {
  THING_FILTER_SELECT,
  THING_FILTER_UPDATED,
  THING_FILTERS_REQUEST,
  THING_FILTERS_REQUEST_SUCCESS,
  THING_FILTERS_REQUEST_ERROR,
  THING_FILTERS_UPDATED,
} from "constants/actionTypes/thingFilter";
import { ADD_FILTER_TYPE } from "constants/actionTypes/filters";
import iotClient from "lib/iotClient";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { THING_FILTER_TYPE } from "constants/filterTypes";

export const selectThingFilter = (type, isActive) => dispatch => {
  dispatch({ type: THING_FILTER_SELECT });
  if (!isActive) {
    let getThingsParams = [];
    if (type === EVENT_TYPE) {
      getThingsParams = [undefined, true];
    } else if (type === MEASUREMENT_TYPE) {
      getThingsParams = [true, undefined];
    }
    dispatch({ type: THING_FILTERS_REQUEST });
    iotClient.thingsService
      .getThings(...getThingsParams)
      .then(res => {
        dispatch({ type: THING_FILTERS_REQUEST_SUCCESS });
        const things = res.body.things.map(thing => thing.name);
        dispatch({ type: THING_FILTERS_UPDATED, thingFilters: things });
      })
      .catch(error => {
        dispatch({ type: THING_FILTERS_REQUEST_ERROR, statusCode: error.statusCode, error });
      });
  }
};

export const updateThingFilter = thing => dispatch => {
  dispatch({ type: THING_FILTER_UPDATED, updatedThingFilter: thing });
};

export const addThingFilter = thing => dispatch => {
  dispatch({ type: ADD_FILTER_TYPE, addedFilterType: THING_FILTER_TYPE });
  dispatch({ type: THING_FILTER_UPDATED, updatedThingFilter: thing });
};
