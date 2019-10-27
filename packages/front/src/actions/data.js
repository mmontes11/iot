import {
  DATA_UPDATED,
  DATA_REQUEST,
  DATA_REQUEST_SUCCESS,
  DATA_REQUEST_ERROR,
  ADD_DATA_ITEM,
  RESET_DATA,
} from "constants/actionTypes/data";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import iotClient from "lib/iotClient";
import { SocketController } from "helpers/socketController";
import { THING_FILTER_TYPE, DATE_FILTER_TYPE } from "constants/filterTypes";
import { RESET } from "constants/actionTypes/common";
import * as fromState from "reducers";
import { TYPE, OBSERVATION, GROUP_BY, THING } from "constants/params";

const getParams = (filterItems, observation, groupBy, thing, timePeriod, startDate, endDate) => {
  let params = {
    type: observation,
  };
  if (groupBy) {
    params = {
      ...params,
      groupBy,
    };
  }
  if (filterItems.includes(THING_FILTER_TYPE) && thing) {
    params = {
      ...params,
      thing,
    };
  }
  if (filterItems.includes(DATE_FILTER_TYPE)) {
    if (timePeriod) {
      params = {
        ...params,
        timePeriod,
      };
    } else {
      if (startDate) {
        params = {
          ...params,
          startDate: startDate.toISOString(),
        };
      }
      if (endDate) {
        params = {
          ...params,
          endDate: endDate.toISOString(),
        };
      }
    }
  }
  return params;
};

const requestStats = (
  filterItems,
  type,
  observation,
  thing,
  timePeriod,
  startDate,
  endDate,
  onStart,
  onSuccess,
  onError,
) => {
  const params = getParams(filterItems, observation, null, thing, timePeriod, startDate, endDate);
  if (type === EVENT_TYPE) {
    onStart();
    iotClient.eventService
      .getStats(params)
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  } else if (type === MEASUREMENT_TYPE) {
    onStart();
    iotClient.measurementService
      .getStats(params)
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  } else {
    onError(new Error("Invalid type"));
  }
};

export const getStats = () => (dispatch, getState) => {
  const state = getState();
  const filterItems = state.filters.items;
  const type = fromState.getParam(state, TYPE).selectedItem;
  const observation = fromState.getParam(state, OBSERVATION).selectedItem;
  const thing = state.filters.thingFilter.selectedItem;
  const {
    timePeriod: { selectedItem: selectedTimePeriod },
    custom: { startDate, endDate },
  } = state.filters.dateFilter;
  if (!type || !observation) {
    return;
  }
  requestStats(
    filterItems,
    type,
    observation,
    thing,
    selectedTimePeriod,
    startDate,
    endDate,
    () => dispatch({ type: DATA_REQUEST }),
    res => {
      dispatch({ type: DATA_REQUEST_SUCCESS });
      dispatch({ type: DATA_UPDATED, items: res.body.stats });
    },
    () => {
      dispatch({ type: DATA_REQUEST_ERROR });
      dispatch({ type: RESET, preserveError: true });
    },
  );
};

const requestData = (
  filterItems,
  type,
  observation,
  groupBy,
  thing,
  timePeriod,
  startDate,
  endDate,
  onStart,
  onSuccess,
  onError,
) => {
  const params = getParams(filterItems, observation, groupBy, thing, timePeriod, startDate, endDate);
  if (type === EVENT_TYPE) {
    onStart();
    iotClient.eventService
      .getData(params)
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  } else if (type === MEASUREMENT_TYPE) {
    onStart();
    iotClient.measurementService
      .getData(params)
      .then(res => onSuccess(res))
      .catch(err => onError(err));
  } else {
    onError(new Error("Invalid type"));
  }
};

export const getData = () => (dispatch, getState) => {
  const state = getState();
  const filterItems = state.filters.items;
  const type = fromState.getParam(state, TYPE).selectedItem;
  const observation = fromState.getParam(state, OBSERVATION).selectedItem;
  const groupBy = fromState.getParam(state, GROUP_BY).selectedItem;
  const thing = state.filters.thingFilter.selectedItem;
  const {
    timePeriod: { selectedItem: selectedTimePeriod },
    custom: { startDate, endDate },
  } = state.filters.dateFilter;
  if (!type || !observation) {
    return;
  }
  requestData(
    filterItems,
    type,
    observation,
    groupBy,
    thing,
    selectedTimePeriod,
    startDate,
    endDate,
    () => dispatch({ type: DATA_REQUEST }),
    ({ body: { data, things } }) => {
      dispatch({ type: DATA_REQUEST_SUCCESS });
      dispatch({ type: DATA_UPDATED, items: data, things });
    },
    () => {
      dispatch({ type: DATA_REQUEST_ERROR });
      dispatch({ type: RESET, preserveError: true });
    },
  );
};

let socketController = null;

export const finishRealTimeData = () => () => {
  if (socketController !== null) {
    socketController.close();
  }
};

export const startRealTimeData = () => (dispatch, getState) => {
  const state = getState();
  const thing = fromState.getParam(state, THING).selectedItem;
  const type = fromState.getParam(state, TYPE).selectedItem;
  if (!thing || !type) {
    return;
  }
  finishRealTimeData()();
  const onData = data => {
    const {
      data: { items },
    } = getState();
    if (items.length === 0) {
      dispatch({ type: DATA_REQUEST_SUCCESS });
    }
    dispatch({ type: ADD_DATA_ITEM, item: data });
  };
  const onError = error => {
    dispatch({ type: DATA_REQUEST_ERROR, error });
    dispatch({ type: RESET, preserveError: true });
  };
  socketController = new SocketController(thing, type, onData, onError);
  socketController.listen();
  dispatch({ type: DATA_REQUEST });
};

export const resetData = () => dispatch => {
  dispatch({ type: RESET_DATA });
};
