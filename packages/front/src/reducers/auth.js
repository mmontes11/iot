import { IS_AUTH, SET_PASSWORD, SET_USERNAME } from "constants/actionTypes/auth";
import { RESET } from "constants/actionTypes/common";

export const initialState = {
  isAuth: false,
  username: null,
  password: null,
};

export default (state = initialState, { type, isAuth, username, password }) => {
  switch (type) {
    case IS_AUTH:
      return { ...initialState, isAuth };
    case SET_USERNAME:
      return { ...state, username };
    case SET_PASSWORD:
      return { ...state, password };
    case RESET:
      return { ...initialState, isAuth: state.isAuth };
    default:
      return state;
  }
};
