import deepFreeze from "deep-freeze";
import dateFilterReducer from "reducers/dateFilter";
import {
  DATE_FILTER_SELECTOR_TOGGLE,
  DATE_FILTER_TIME_PERIOD_SELECT,
  DATE_FILTER_TIME_PERIOD_UPDATED,
  DATE_FILTER_TIME_PERIODS_REQUEST,
  DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS,
  DATE_FILTER_TIME_PERIODS_REQUEST_ERROR,
  DATE_FILTER_TIME_PERIODS_UPDATED,
  DATE_FILTER_START_DATE_UPDATED,
  DATE_FILTER_END_DATE_UPDATED,
} from "constants/actionTypes/dateFilter";
import { RESET } from "constants/actionTypes/common";
import { initialState } from "../constants/index";

const thingFilterInitialState = initialState.filters.dateFilter;
deepFreeze(thingFilterInitialState);

describe("reducers/dateFilter", () => {
  it("has a default state", () => {
    expect(dateFilterReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(dateFilterReducer(thingFilterInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_SELECTOR_TOGGLE", () => {
    expect(dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_SELECTOR_TOGGLE })).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIOD_SELECT", () => {
    expect(dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_TIME_PERIOD_SELECT })).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIOD_UPDATED", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_TIME_PERIOD_UPDATED, updatedTimePeriod: "foo" }),
    ).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIODS_REQUEST", () => {
    expect(dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_TIME_PERIODS_REQUEST })).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_TIME_PERIODS_REQUEST_SUCCESS }),
    ).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIODS_REQUEST_ERROR", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_TIME_PERIODS_REQUEST_ERROR }),
    ).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_TIME_PERIODS_UPDATED", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, {
        type: DATE_FILTER_TIME_PERIODS_UPDATED,
        timePeriods: ["foo", "bar"],
      }),
    ).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_START_DATE_UPDATED", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_START_DATE_UPDATED, updatedStartDate: "foo" }),
    ).toMatchSnapshot();
  });
  it("reduces DATE_FILTER_END_DATE_UPDATED", () => {
    expect(
      dateFilterReducer(thingFilterInitialState, { type: DATE_FILTER_END_DATE_UPDATED, updatedEndDate: "bar" }),
    ).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(dateFilterReducer(thingFilterInitialState, { type: RESET })).toMatchSnapshot();
  });
});
