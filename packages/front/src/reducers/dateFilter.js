import {
  DATE_FILTER_SELECTOR_TOGGLE,
  DATE_FILTER_TIME_PERIOD_SELECT,
  DATE_FILTER_TIME_PERIOD_UPDATED,
  DATE_FILTER_TIME_PERIODS_REQUEST,
  DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS,
  DATE_FILTER_TIME_PERIODS_REQUEST_ERROR,
  DATE_FILTER_TIME_PERIODS_UPDATED,
  DATE_FILTER_START_DATE_UPDATED,
  DATE_FILTER_END_DATE_UPDATED,
} from "constants/actionTypes/dateFilter";
import { RESET } from "constants/actionTypes/common";

export const initialState = {
  isCustomSelected: false,
  timePeriod: {
    isLoading: false,
    isActive: false,
    isDisabled: false,
    items: [],
    selectedItem: null,
  },
  custom: {
    startDate: null,
    endDate: null,
  },
};

export default (state = initialState, { type, updatedTimePeriod, timePeriods, updatedStartDate, updatedEndDate }) => {
  switch (type) {
    case DATE_FILTER_SELECTOR_TOGGLE:
      return { ...initialState, isCustomSelected: !state.isCustomSelected };
    case DATE_FILTER_TIME_PERIOD_SELECT:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isActive: !state.timePeriod.isActive,
        },
      };
    case DATE_FILTER_TIME_PERIOD_UPDATED:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isActive: false,
          selectedItem: updatedTimePeriod,
        },
      };
    case DATE_FILTER_TIME_PERIODS_REQUEST:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isLoading: true,
          isDisabled: true,
          isActive: false,
        },
      };
    case DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isLoading: false,
          isDisabled: false,
          isActive: false,
        },
      };
    case DATE_FILTER_TIME_PERIODS_REQUEST_ERROR:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isLoading: false,
          isDisabled: false,
          isActive: false,
        },
      };
    case DATE_FILTER_TIME_PERIODS_UPDATED:
      return {
        ...state,
        timePeriod: {
          ...state.timePeriod,
          isLoading: false,
          isDisabled: false,
          isActive: true,
          items: timePeriods,
        },
      };
    case DATE_FILTER_START_DATE_UPDATED:
      return {
        ...state,
        custom: {
          ...state.custom,
          startDate: updatedStartDate,
        },
      };
    case DATE_FILTER_END_DATE_UPDATED:
      return {
        ...state,
        custom: {
          ...state.custom,
          endDate: updatedEndDate,
        },
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};
