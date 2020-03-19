import {
  THING_FILTER_SELECT,
  THING_FILTER_UPDATED,
  THING_FILTERS_REQUEST,
  THING_FILTERS_REQUEST_SUCCESS,
  THING_FILTERS_REQUEST_ERROR,
  THING_FILTERS_UPDATED,
} from "constants/actionTypes/thingFilter";
import { RESET } from "constants/actionTypes/common";

export const initialState = {
  isLoading: false,
  isActive: false,
  isDisabled: false,
  items: [],
  selectedItem: null,
};

export default (state = initialState, { type, updatedThingFilter, thingFilters }) => {
  switch (type) {
    case THING_FILTER_SELECT:
      return { ...state, isActive: !state.isActive };
    case THING_FILTER_UPDATED:
      return { ...state, selectedItem: updatedThingFilter, isActive: false };
    case THING_FILTERS_REQUEST:
      return { ...state, isLoading: true, isDisabled: true, isActive: false };
    case THING_FILTERS_REQUEST_SUCCESS:
      return { ...state, isLoading: false, isDisabled: false, isActive: false };
    case THING_FILTERS_REQUEST_ERROR:
      return { ...state, isLoading: false, isDisabled: false, isActive: false };
    case THING_FILTERS_UPDATED:
      return { ...state, items: thingFilters, isLoading: false, isDisabled: false, isActive: true };
    case RESET:
      return initialState;
    default:
      return state;
  }
};
