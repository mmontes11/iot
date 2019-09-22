import deepFreeze from "deep-freeze";
import requestReducer from "reducers/request";
import { LOGIN_REQUEST, LOGIN_REQUEST_SUCCESS, LOGIN_REQUEST_ERROR } from "constants/actionTypes/auth";
import { RESET } from "constants/actionTypes/common";
import { initialState } from "../constants/index";

const requestInitialState = initialState.request;
deepFreeze(requestInitialState);

describe("reducers/request", () => {
  it("has a default state", () => {
    expect(requestReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(requestReducer(requestInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces /_REQUEST$/", () => {
    expect(requestReducer(requestInitialState, { type: LOGIN_REQUEST })).toMatchSnapshot();
    requestReducer(requestInitialState, { type: LOGIN_REQUEST_SUCCESS });
  });
  it("reduces /_REQUEST_SUCCESS$/", () => {
    requestReducer(requestInitialState, { type: LOGIN_REQUEST });
    expect(requestReducer(requestInitialState, { type: LOGIN_REQUEST_ERROR })).toMatchSnapshot();
  });
  it("reduces /_REQUEST_ERROR$/", () => {
    requestReducer(requestInitialState, { type: LOGIN_REQUEST });
    expect(requestReducer(requestInitialState, { type: LOGIN_REQUEST_ERROR })).toMatchSnapshot();
  });
  it("simulates a flow of requests", () => {
    requestReducer(requestInitialState, { type: LOGIN_REQUEST });
    requestReducer(requestInitialState, { type: LOGIN_REQUEST });
    requestReducer(requestInitialState, { type: LOGIN_REQUEST });
    requestReducer(requestInitialState, { type: LOGIN_REQUEST_SUCCESS });
    expect(requestReducer(requestInitialState, { type: LOGIN_REQUEST_ERROR })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(requestReducer(requestInitialState, { type: RESET })).toMatchSnapshot();
  });
});
