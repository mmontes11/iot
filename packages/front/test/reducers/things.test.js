import deepFreeze from "deep-freeze";
import thingsReducer from "reducers/things";
import { THINGS_UPDATED, THING_SELECTED } from "constants/actionTypes/things";
import { RESET } from "constants/actionTypes/common";
import { initialState } from "../constants/index";

const thingsInitialState = initialState.things;
deepFreeze(thingsInitialState);

describe("reducers/things", () => {
  it("has a default state", () => {
    expect(thingsReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(thingsReducer(thingsInitialState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces THINGS_UPDATED", () => {
    expect(thingsReducer(thingsInitialState, { type: THINGS_UPDATED, things: ["foo", "bar"] })).toMatchSnapshot();
  });
  it("reduces THING_SELECTED", () => {
    expect(thingsReducer(thingsInitialState, { type: THING_SELECTED, thing: "foo" })).toMatchSnapshot();
  });
  it("selects and deselects a thing", () => {
    let state = thingsReducer(thingsInitialState, { type: THING_SELECTED, thing: "foo" });
    expect(state).toMatchSnapshot();
    state = thingsReducer(state, { type: THING_SELECTED, thing: "foo" });
    expect(state).toMatchSnapshot();
  });
  it("reduces RESET", () => {
    expect(thingsReducer(thingsInitialState, { type: RESET })).toMatchSnapshot();
  });
});
