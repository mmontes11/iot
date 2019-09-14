import { RESET } from "constants/actionTypes/common";
import {
  DATA_REQUEST,
  DATA_REQUEST_SUCCESS,
  DATA_REQUEST_ERROR,
  DATA_UPDATED,
  ADD_DATA_ITEM,
  RESET_DATA,
} from "constants/actionTypes/data";

export const initialState = {
  items: [],
  things: [],
  isLoading: false,
};

export default (state = initialState, { type, items, things, item }) => {
  switch (type) {
    case DATA_REQUEST:
      return { ...state, isLoading: true };
    case DATA_REQUEST_SUCCESS:
      return { ...state, isLoading: false };
    case DATA_REQUEST_ERROR:
      return { ...state, isLoading: false };
    case DATA_UPDATED:
      return { ...state, items, things };
    case ADD_DATA_ITEM:
      return { ...state, items: [...state.items, item] };
    case RESET_DATA:
      return initialState;
    case RESET:
      return initialState;
    default:
      return state;
  }
};
