import { FILTER_TYPE_SELECT, ADD_FILTER_TYPE, DELETE_FILTER_TYPE } from "constants/actionTypes/filters";

export const selectFilterType = () => dispatch => {
  dispatch({ type: FILTER_TYPE_SELECT });
};

export const addFilterType = addedFilterType => dispatch => {
  dispatch({ type: ADD_FILTER_TYPE, addedFilterType });
};

export const deleteFilterType = deletedFilterType => dispatch => {
  dispatch({ type: DELETE_FILTER_TYPE, deletedFilterType });
};
