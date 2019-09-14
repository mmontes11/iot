import { RESET } from "constants/actionTypes/common";

export const reset = preserveError => dispatch => {
  dispatch({ type: RESET, preserveError });
};
