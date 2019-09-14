import {
  PARAM_SELECT,
  PARAM_UPDATE,
  PARAM_RESET,
  PARAM_REQUEST,
  PARAM_REQUEST_SUCCESS,
  PARAM_REQUEST_ERROR,
  PARAM_ITEMS_UPDATED,
  PARAM_DISABLE,
} from "constants/actionTypes/params";
import { EVENT_TYPE, MEASUREMENT_TYPE, OBSERVATION_TYPES } from "constants/observationTypes";
import { TYPE, OBSERVATION, GROUPBY, THING } from "constants/params";
import iotClient from "lib/iotClient";
import * as fromState from "reducers";
import { isEmpty } from "helpers/validation";

const requestObservations = (type, onStart, onSuccess, onError) => {
  if (type === EVENT_TYPE) {
    onStart();
    iotClient.eventService
      .getTypes()
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  } else if (type === MEASUREMENT_TYPE) {
    onStart();
    iotClient.measurementService
      .getTypes()
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  }
};

const requestObservationsDispatchingActions = (dispatch, type, cb) => {
  if (!type) {
    cb();
    return;
  }
  requestObservations(
    type,
    () => dispatch({ type: PARAM_REQUEST, param: OBSERVATION }),
    res => {
      dispatch({ type: PARAM_REQUEST_SUCCESS, param: OBSERVATION, statusCode: res.statusCode, error: null });
      dispatch({ type: PARAM_RESET, param: OBSERVATION });
      dispatch({ type: PARAM_ITEMS_UPDATED, param: OBSERVATION, items: res.body.types });
      cb();
    },
    error => {
      dispatch({ type: PARAM_REQUEST_ERROR, param: OBSERVATION, statusCode: error.statusCode, error });
      cb();
    },
  );
};

export const selectType = () => dispatch => {
  dispatch({ type: PARAM_ITEMS_UPDATED, param: TYPE, items: OBSERVATION_TYPES });
  dispatch({ type: PARAM_SELECT, param: TYPE });
};

export const updateType = type => dispatch => {
  dispatch({ type: PARAM_UPDATE, param: TYPE, selectedItem: type });
  requestObservationsDispatchingActions(dispatch, type, () => undefined);
};

export const selectObservation = () => (dispatch, getState) => {
  const state = getState();
  const observation = fromState.getParam(state, OBSERVATION);
  const dispatchSelectObservation = () => dispatch({ type: PARAM_SELECT, param: OBSERVATION });
  if (observation && !isEmpty(observation.items)) {
    dispatchSelectObservation();
  } else {
    const type = fromState.getParam(state, TYPE);
    if (type && type.selectedItem) {
      requestObservationsDispatchingActions(dispatch, type.selectedItem, dispatchSelectObservation);
    }
  }
};

export const updateObservation = observation => dispatch => {
  dispatch({ type: PARAM_UPDATE, param: OBSERVATION, selectedItem: observation });
};

export const selectGroupBy = () => (dispatch, getState) => {
  const state = getState();
  const groupBy = fromState.getParam(state, GROUPBY);
  if (groupBy && !isEmpty(groupBy.items)) {
    dispatch({ type: PARAM_SELECT, param: GROUPBY });
  } else {
    dispatch({ type: PARAM_REQUEST, param: GROUPBY });
    iotClient.timePeriodsService
      .getSupportedTimePeriods()
      .then(res => {
        dispatch({ type: PARAM_REQUEST_SUCCESS, param: GROUPBY, statusCode: res.statusCode, error: null });
        dispatch({ type: PARAM_ITEMS_UPDATED, param: GROUPBY, items: res.body.timePeriods });
        dispatch({ type: PARAM_SELECT, param: GROUPBY });
      })
      .catch(error => {
        dispatch({ type: PARAM_REQUEST_ERROR, param: GROUPBY, statusCode: error.statusCode, error });
      });
  }
};

export const updateGroupBy = groupBy => dispatch => {
  dispatch({ type: PARAM_UPDATE, param: GROUPBY, selectedItem: groupBy });
};

export const updateParams = params => dispatch => {
  const [firstParam, ...rest] = Object.keys(params);
  dispatch({ type: PARAM_UPDATE, param: firstParam, selectedItem: params[firstParam] });
  rest.forEach(key => {
    dispatch({ type: PARAM_DISABLE, param: key });
    dispatch({ type: PARAM_UPDATE, param: key, selectedItem: params[key] });
  });
};

export const selectThing = () => (dispatch, getState) => {
  const thing = fromState.getParam(getState(), THING);
  if (thing && !isEmpty(thing.items)) {
    dispatch({ type: PARAM_SELECT, param: THING });
  } else {
    dispatch({ type: PARAM_REQUEST, param: THING });
    iotClient.thingsService
      .getThings(true)
      .then(res => {
        dispatch({ type: PARAM_REQUEST_SUCCESS, param: THING, statusCode: res.statusCode, error: null });
        dispatch({ type: PARAM_ITEMS_UPDATED, param: THING, items: res.body.things });
        dispatch({ type: PARAM_SELECT, param: THING });
      })
      .catch(error => {
        dispatch({ type: PARAM_REQUEST_ERROR, param: THING, statusCode: error.statusCode, error });
      });
  }
};

export const updateThing = thingName => (dispatch, getState) => {
  dispatch({ type: PARAM_UPDATE, param: THING, selectedItem: thingName });
  const thingParam = fromState.getParam(getState(), THING);
  const thing = thingParam.items.find(item => item.name === thingName);
  dispatch({ type: PARAM_RESET, param: TYPE });
  dispatch({ type: PARAM_ITEMS_UPDATED, param: TYPE, items: thing.supportedObservationTypes.measurement });
};

export const selectMeasurementType = () => dispatch => {
  dispatch({ type: PARAM_SELECT, param: TYPE });
};

export const updateMeasurementType = type => dispatch => {
  dispatch({ type: PARAM_UPDATE, param: TYPE, selectedItem: type });
};
