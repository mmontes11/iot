import { TOGGLE_HAMBURGER_MENU, TOGGLE_MAP_DIALOG, SET_SHOW_ERROR } from "constants/actionTypes/app";
import { RESET } from "constants/actionTypes/common";

export const initialState = {
  isHamburgerMenuExpanded: false,
  isMapDialogOpened: false,
  showError: true,
};

export default (state = initialState, { type, showError, preserveError }) => {
  if (/_REQUEST_ERROR$/.test(type)) {
    return { ...state, showError: true };
  }
  switch (type) {
    case TOGGLE_HAMBURGER_MENU:
      return { ...state, isHamburgerMenuExpanded: !state.isHamburgerMenuExpanded };
    case TOGGLE_MAP_DIALOG:
      return { ...state, isMapDialogOpened: !state.isMapDialogOpened };
    case SET_SHOW_ERROR:
      return { ...state, showError };
    case RESET:
      if (preserveError) {
        return { ...initialState, showError: state.showError };
      }
      return initialState;

    default:
      return state;
  }
};
