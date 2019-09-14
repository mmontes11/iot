import { RESET } from "constants/actionTypes/common";

export const initialState = {
  pending: 0,
  statusCode: null,
  error: null,
};

export default (state = initialState, { type, statusCode, error, preserveError }) => {
  if (/_REQUEST$/.test(type)) {
    return { ...state, pending: state.pending + 1 };
  }
  if (/_REQUEST_SUCCESS$/.test(type)) {
    return { ...state, pending: state.pending - 1, statusCode, error: null };
  }
  if (/_REQUEST_ERROR$/.test(type)) {
    return { ...state, pending: state.pending - 1, statusCode, error };
  }
  if (type === RESET) {
    if (preserveError) {
      return { ...initialState, error: state.error };
    }
    return initialState;
  }
  return state;
};

export const isLoading = state => state.pending !== 0;
export const hasError = state => state.error !== null;
