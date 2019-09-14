import deepFreeze from "deep-freeze";
import authReducer from "reducers/auth";
import { IS_AUTH, SET_USERNAME, SET_PASSWORD } from "constants/actionTypes/auth";
import { RESET } from "constants/actionTypes/common";
import { initialState } from "../constants/index";

const authInitialState = initialState.auth;
deepFreeze(authInitialState);

describe("reducers/auth", () => {
  it("has a default state", () => {
    expect(authReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(authReducer(authInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces IS_AUTH", () => {
    expect(authReducer(authInitialState, { type: IS_AUTH, isAuth: true })).toMatchSnapshot();
  });
  it("reduces SET_USERNAME", () => {
    expect(authReducer(authInitialState, { type: SET_USERNAME, username: "USERNAME" })).toMatchSnapshot();
  });
  it("reduces SET_PASSWORD", () => {
    expect(authReducer(authInitialState, { type: SET_PASSWORD, password: "PASSWORD" })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(authReducer(authInitialState, { type: RESET })).toMatchSnapshot();
  });
});
