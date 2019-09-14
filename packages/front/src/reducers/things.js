import { THINGS_UPDATED, THING_SELECTED, SHOW_THING_NOT_FOUND_ERROR } from "constants/actionTypes/things";
import { RESET } from "constants/actionTypes/common";

export const initialState = {
  items: [],
  selectedItem: null,
  showNotFoundError: false,
};

export default (state = initialState, { type, things, thing, showNotFoundError }) => {
  switch (type) {
    case THINGS_UPDATED:
      return { ...state, items: things };
    case THING_SELECTED:
      if (state.selectedItem !== null && state.selectedItem.name === thing.name) {
        return { ...state, selectedItem: null };
      }
      return { ...state, selectedItem: thing };
    case SHOW_THING_NOT_FOUND_ERROR:
      return { ...state, showNotFoundError };
    case RESET:
      return { ...initialState, items: state.items };
    default:
      return state;
  }
};
