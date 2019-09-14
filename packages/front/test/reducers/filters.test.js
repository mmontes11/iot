import deepFreeze from "deep-freeze";
import filtersReducer from "reducers/filters";
import { RESET } from "constants/actionTypes/common";
import { FILTER_TYPE_SELECT, ADD_FILTER_TYPE, DELETE_FILTER_TYPE } from "constants/actionTypes/filters";
import { THING_FILTER_TYPE, DATE_FILTER_TYPE, FILTER_TYPES } from "constants/filterTypes";
import { initialState } from "../constants/index";

const filtersInitialState = initialState.filters;
deepFreeze(filtersInitialState);

describe("reducers/filters", () => {
  it("has a default state", () => {
    expect(filtersReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(filtersReducer(filtersInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces FILTER_TYPE_SELECT", () => {
    expect(filtersReducer(filtersInitialState, { type: FILTER_TYPE_SELECT })).toMatchSnapshot();
  });
  it("reduces ADD_FILTER_TYPE", () => {
    const state = {
      ...filtersInitialState,
      items: [THING_FILTER_TYPE],
    };
    deepFreeze(state);
    expect(filtersReducer(state, { type: ADD_FILTER_TYPE, addedFilterType: THING_FILTER_TYPE })).toMatchSnapshot();
    expect(filtersReducer(state, { type: ADD_FILTER_TYPE, addedFilterType: DATE_FILTER_TYPE })).toMatchSnapshot();
  });
  it("reduces DELETE_FILTER_TYPE", () => {
    const state = {
      ...filtersInitialState,
      items: FILTER_TYPES,
    };
    deepFreeze(state);
    expect(filtersReducer(state, { type: DELETE_FILTER_TYPE, deletedFilterType: THING_FILTER_TYPE })).toMatchSnapshot();
    expect(filtersReducer(state, { type: DELETE_FILTER_TYPE, deletedFilterType: DATE_FILTER_TYPE })).toMatchSnapshot();
    expect(filtersReducer(state, { type: DELETE_FILTER_TYPE, deletedFilterType: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(filtersReducer(filtersInitialState, { type: RESET })).toMatchSnapshot();
  });
});
