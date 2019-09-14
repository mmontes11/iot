import deepFreeze from "deep-freeze";
import appReducer from "reducers/app";
import { TOGGLE_HAMBURGER_MENU, TOGGLE_MAP_DIALOG, SET_SHOW_ERROR } from "constants/actionTypes/app";
import { RESET } from "constants/actionTypes/common";
import { initialState } from "../constants/index";

const appInitialState = initialState.app;
deepFreeze(appInitialState);

describe("reducers/app", () => {
  it("has a default state", () => {
    expect(appReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(appReducer(appInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces TOGGLE_HAMBURGUER_MENU", () => {
    expect(appReducer(appInitialState, { type: TOGGLE_HAMBURGER_MENU })).toMatchSnapshot();
  });
  it("reduces TOGGLE_MAP_DIALOG", () => {
    expect(appReducer(appInitialState, { type: TOGGLE_MAP_DIALOG })).toMatchSnapshot();
  });
  it("reduces SET_SHOW_ERROR", () => {
    expect(appReducer(appInitialState, { type: SET_SHOW_ERROR, showError: true })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(appReducer(appInitialState, { type: RESET })).toMatchSnapshot();
  });
});
