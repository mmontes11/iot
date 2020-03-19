import {
  IS_AUTH,
  SET_USERNAME,
  SET_PASSWORD,
  LOGIN_REQUEST,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_ERROR,
} from "constants/actionTypes/auth";
import { setShowError } from "actions/app";
import { getToken } from "helpers/localStorage";
// eslint-disable-next-line import/no-cycle
import iotClient from "lib/iotClient";

export const checkAuth = () => dispatch => {
  const token = getToken();
  const hasToken = token !== null;
  dispatch({ type: IS_AUTH, isAuth: hasToken });
  if (hasToken) {
    iotClient.authService
      .checkAuthToken(token)
      .then(({ statusCode }) => dispatch({ type: IS_AUTH, isAuth: statusCode === 200 }))
      .catch(() => dispatch({ type: IS_AUTH, isAuth: false }));
  }
};

export const setUsername = username => dispatch => {
  dispatch({ type: SET_USERNAME, username });
};

export const setPassword = password => dispatch => {
  dispatch({ type: SET_PASSWORD, password });
};

export const login = () => (dispatch, getState) => {
  dispatch({ type: LOGIN_REQUEST });
  const { username, password } = getState().auth;
  iotClient.authService.setCredentials(username, password);
  iotClient.authService
    .getToken()
    .then(response => {
      dispatch({
        type: LOGIN_REQUEST_SUCCESS,
        statusCode: response.statusCode,
        error: null,
      });
      checkAuth()(dispatch);
    })
    .catch(error => {
      dispatch({
        type: LOGIN_REQUEST_ERROR,
        statusCode: error.statusCode,
        error,
      });
      setShowError(true)(dispatch);
    });
};

export const logout = () => dispatch => {
  iotClient.authService
    .logout()
    .then(() => {
      checkAuth()(dispatch);
    })
    .catch(() => {
      checkAuth()(dispatch);
    });
};
