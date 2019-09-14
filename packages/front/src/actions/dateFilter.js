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
import { ADD_FILTER_TYPE } from "constants/actionTypes/filters";
import { DATE_FILTER_TYPE } from "constants/filterTypes";
import iotClient from "lib/iotClient";

export const toggleDateFilterType = () => dispatch => {
  dispatch({ type: DATE_FILTER_SELECTOR_TOGGLE });
};

export const selectTimePeriod = isActive => dispatch => {
  dispatch({ type: DATE_FILTER_TIME_PERIOD_SELECT });
  if (!isActive) {
    dispatch({ type: DATE_FILTER_TIME_PERIODS_REQUEST });
    iotClient.timePeriodsService
      .getSupportedTimePeriods()
      .then(({ body: { timePeriods } }) => {
        dispatch({ type: DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS });
        dispatch({ type: DATE_FILTER_TIME_PERIODS_UPDATED, timePeriods });
      })
      .catch(error => {
        dispatch({ type: DATE_FILTER_TIME_PERIODS_REQUEST_ERROR, statusCode: error.statusCode, error });
      });
  }
};

export const updateTimePeriod = updatedTimePeriod => dispatch => {
  dispatch({ type: DATE_FILTER_TIME_PERIOD_UPDATED, updatedTimePeriod });
};

export const updateStartDate = updatedStartDate => dispatch => {
  dispatch({ type: DATE_FILTER_START_DATE_UPDATED, updatedStartDate });
};

export const updateEndDate = updatedEndDate => dispatch => {
  dispatch({ type: DATE_FILTER_END_DATE_UPDATED, updatedEndDate });
};

export const addTimePeriodFilter = updatedTimePeriod => dispatch => {
  dispatch({ type: ADD_FILTER_TYPE, addedFilterType: DATE_FILTER_TYPE });
  dispatch({ type: DATE_FILTER_TIME_PERIOD_UPDATED, updatedTimePeriod });
};

export const addCustomTimePeriodFilter = (updatedStartDate, updatedEndDate) => dispatch => {
  dispatch({ type: ADD_FILTER_TYPE, addedFilterType: DATE_FILTER_TYPE });
  const startDate = new Date(updatedStartDate);
  const endDate = new Date(updatedEndDate);
  if (!Number.isNaN(startDate) || !Number.isNaN(endDate)) {
    dispatch({ type: DATE_FILTER_SELECTOR_TOGGLE, isCustomSelected: true });
  }
  if (!Number.isNaN(startDate)) {
    dispatch({ type: DATE_FILTER_START_DATE_UPDATED, updatedStartDate: startDate });
  }
  if (!Number.isNaN(endDate)) {
    dispatch({ type: DATE_FILTER_END_DATE_UPDATED, updatedEndDate: endDate });
  }
};
