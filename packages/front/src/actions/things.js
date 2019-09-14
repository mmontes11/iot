import {
  THINGS_UPDATED,
  THING_SELECTED,
  THINGS_REQUEST,
  THINGS_REQUEST_SUCCESS,
  THINGS_REQUEST_ERROR,
  SHOW_THING_NOT_FOUND_ERROR,
} from "constants/actionTypes/things";
import iotClient from "lib/iotClient";

export const getThings = () => dispatch => {
  dispatch({ type: THINGS_REQUEST });
  iotClient.thingsService
    .getThings()
    .then(res => {
      dispatch({ type: THINGS_REQUEST_SUCCESS, statusCode: res.statusCode, error: null });
      dispatch({ type: THINGS_UPDATED, things: res.body.things });
    })
    .catch(error => dispatch({ type: THINGS_REQUEST_ERROR, statusCode: error.statusCode, error }));
};

export const selectThing = thing => dispatch => {
  dispatch({ type: THING_SELECTED, thing });
};

export const showThingNotFoundError = showNotFoundError => dispatch => {
  dispatch({ type: SHOW_THING_NOT_FOUND_ERROR, showNotFoundError });
};
