import deepFreeze from "deep-freeze";
import thingFilterReducer from "reducers/thingFilter";
import {
  THING_FILTER_SELECT,
  THING_FILTER_UPDATED,
  THING_FILTERS_REQUEST,
  THING_FILTERS_REQUEST_SUCCESS,
  THING_FILTERS_REQUEST_ERROR,
  THING_FILTERS_UPDATED,
} from "constants/actionTypes/thingFilter";
import { RESET } from "constants/actionTypes/common";

import { initialState } from "../constants/index";

const thingFilterInitialState = initialState.filters.thingFilter;
deepFreeze(thingFilterInitialState);

describe("reducers/thingFilter", () => {
  it("has a default state", () => {
    expect(thingFilterReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces THING_FILTER_SELECT", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTER_SELECT })).toMatchSnapshot();
  });
  it("reduces THING_FILTER_UPDATED", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTER_UPDATED })).toMatchSnapshot();
  });
  it("reduces THING_FILTERS_REQUEST", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTERS_REQUEST })).toMatchSnapshot();
  });
  it("reduces THING_FILTERS_REQUEST_SUCCESS", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTERS_REQUEST_SUCCESS })).toMatchSnapshot();
  });
  it("reduces THING_FILTERS_REQUEST_ERROR", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTERS_REQUEST_ERROR })).toMatchSnapshot();
  });
  it("reduces THING_FILTERS_UPDATED", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: THING_FILTERS_UPDATED })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(thingFilterReducer(thingFilterInitialState, { type: RESET })).toMatchSnapshot();
  });
});
