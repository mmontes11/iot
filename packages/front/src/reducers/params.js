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
import { RESET } from "constants/actionTypes/common";
import deepEqual from "deep-equal";

export const initialState = {
  byId: {},
  allIds: [],
  isResetDisabled: true,
};

const paramInitialState = {
  items: [],
  isActive: false,
  isLoading: false,
  isDisabled: false,
  selectedItem: null,
};

const addParamIfNeeded = (state, paramId) => {
  if (state.allIds.includes(paramId)) {
    return state;
  }
  return {
    ...state,
    byId: {
      ...state.byId,
      [paramId]: paramInitialState,
    },
    allIds: [...state.allIds, paramId],
  };
};

const updateParam = (state, paramId, param) => ({
  ...state,
  byId: {
    ...state.byId,
    [paramId]: param,
  },
});

const allParamsInInitialState = state => Object.values(state.byId).every(param => deepEqual(param, paramInitialState));

export default (state = initialState, { type, param: paramId, selectedItem, items }) => {
  if (type === RESET) {
    return initialState;
  }
  if (!paramId) {
    return state;
  }
  let newState = { ...state };
  newState = addParamIfNeeded(newState, paramId);
  const param = newState.byId[paramId];
  switch (type) {
    case PARAM_SELECT:
      return updateParam(newState, paramId, { ...param, isActive: !param.isActive });
    case PARAM_UPDATE:
      return { ...updateParam(newState, paramId, { ...param, isActive: false, selectedItem }), isResetDisabled: false };
    case PARAM_RESET: {
      const newStateWithResetParam = updateParam(newState, paramId, paramInitialState);
      return { ...newStateWithResetParam, isResetDisabled: allParamsInInitialState(newStateWithResetParam) };
    }
    case PARAM_REQUEST:
      return updateParam(newState, paramId, { ...param, isLoading: true, isDisabled: true });
    case PARAM_REQUEST_SUCCESS:
      return updateParam(newState, paramId, { ...param, isLoading: false, isDisabled: false });
    case PARAM_REQUEST_ERROR:
      return updateParam(newState, paramId, { ...param, isLoading: false, isDisabled: false });
    case PARAM_ITEMS_UPDATED:
      return updateParam(newState, paramId, { ...param, items });
    case PARAM_DISABLE:
      return updateParam(newState, paramId, { ...param, isDisabled: true });
    default:
      return state;
  }
};

export const getParam = (state, paramName) => state.byId[paramName] || {};
