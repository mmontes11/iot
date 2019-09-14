import deepFreeze from "deep-freeze";
import dataReducer from "reducers/data";
import { RESET } from "constants/actionTypes/common";
import { DATA_REQUEST, DATA_REQUEST_SUCCESS, DATA_REQUEST_ERROR, DATA_UPDATED } from "constants/actionTypes/data";
import { initialState } from "../constants/index";

const dataInitialState = initialState.data;
deepFreeze(dataInitialState);

describe("reducers/data", () => {
  it("has a default state", () => {
    expect(dataReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(dataReducer(dataInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces DATA_REQUEST", () => {
    expect(dataReducer(dataInitialState, { type: DATA_REQUEST })).toMatchSnapshot();
  });
  it("reduces DATA_REQUEST_SUCCESS", () => {
    expect(dataReducer(dataInitialState, { type: DATA_REQUEST_SUCCESS })).toMatchSnapshot();
  });
  it("reduces DATA_REQUEST_ERROR", () => {
    expect(dataReducer(dataInitialState, { type: DATA_REQUEST_ERROR })).toMatchSnapshot();
  });
  it("reduces DATA_UPDATED", () => {
    expect(dataReducer(dataInitialState, { type: DATA_UPDATED, items: [] })).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(dataReducer(dataInitialState, { type: RESET })).toMatchSnapshot();
  });
});
