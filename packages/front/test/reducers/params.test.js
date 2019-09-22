import deepFreeze from "deep-freeze";
import paramsReducer, { initialState as paramsInitialState } from "reducers/params";
import {
  PARAM_SELECT,
  PARAM_UPDATE,
  PARAM_RESET,
  PARAM_REQUEST,
  PARAM_REQUEST_SUCCESS,
  PARAM_REQUEST_ERROR,
  PARAM_ITEMS_UPDATED,
} from "constants/actionTypes/params";
import { RESET } from "constants/actionTypes/common";
import { TYPE } from "constants/params";

deepFreeze(paramsInitialState);

describe("reducers/params", () => {
  it("has a default state", () => {
    expect(paramsReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(paramsReducer(paramsInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces PARAM_SELECT", () => {
    expect(paramsReducer(paramsInitialState, { type: PARAM_SELECT, param: TYPE })).toMatchSnapshot();
  });
  it("reduces PARAM_UPDATE by updating TYPE", () => {
    expect(
      paramsReducer(paramsInitialState, { type: PARAM_UPDATE, param: TYPE, selectedItem: "foo" }),
    ).toMatchSnapshot();
  });
  it("reduces PARAM_RESET by reseting TYPE", () => {
    paramsReducer(paramsInitialState, { type: PARAM_UPDATE, param: TYPE, selectedItem: "foo" });
    expect(paramsReducer(paramsInitialState, { type: PARAM_RESET, param: TYPE })).toMatchSnapshot();
  });
  it("reduces PARAM_REQUEST", () => {
    expect(paramsReducer(paramsInitialState, { type: PARAM_REQUEST, param: TYPE })).toMatchSnapshot();
  });
  it("reduces PARAM_REQUEST_SUCCESS", () => {
    expect(paramsReducer(paramsInitialState, { type: PARAM_REQUEST_SUCCESS, param: TYPE })).toMatchSnapshot();
  });
  it("reduces PARAM_REQUEST_ERROR", () => {
    expect(paramsReducer(paramsInitialState, { type: PARAM_REQUEST_ERROR, param: TYPE })).toMatchSnapshot();
  });
  it("reduces PARAM_ITEMS_UPDATED", () => {
    expect(
      paramsReducer(paramsInitialState, {
        type: PARAM_ITEMS_UPDATED,
        param: TYPE,
        items: ["foo", "bar"],
      }),
    ).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(paramsReducer(paramsInitialState, { type: RESET })).toMatchSnapshot();
  });
});
