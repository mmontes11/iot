import deepFreeze from "deep-freeze";
import rootReducer, { isLoading, hasError } from "reducers";

jest.mock("reducers/auth", () => (state = false, { type }) => {
  switch (type) {
    case "ACTION":
      return "STATE";
    default:
      return state;
  }
});

describe("reducers/index", () => {
  it("combines other reducers", () => {
    expect(rootReducer).toMatchSnapshot();
  });
  const mockState = {
    auth: "AUTH",
    request: "REQUEST",
  };
  deepFreeze(mockState);
  it("has a default state", () => {
    expect(rootReducer(undefined, { type: "@init" })).toMatchSnapshot();
  });
  it("reduces nothing", () => {
    expect(rootReducer(mockState, { type: "WHATEVER" })).toMatchSnapshot();
  });
  it("reduces other actions", () => {
    expect(rootReducer(mockState, { type: "ACTION" })).toMatchSnapshot();
  });
  describe("isLoading", () => {
    it("indicates that the app is loading", () => {
      const state = {
        request: {
          pending: 1,
        },
      };
      expect(isLoading(state)).toBeTruthy();
    });
    it("indicates that the app is not loading", () => {
      const state = {
        request: {
          pending: 0,
        },
      };
      deepFreeze(state);
      expect(isLoading(state)).toBeFalsy();
    });
  });
  describe("hasError", () => {
    it("indicates that the app has an error", () => {
      const state = {
        request: {
          error: new Error(),
        },
      };
      expect(hasError(state)).toBeTruthy();
    });
    it("indicates that the app has not an error", () => {
      const state = {
        request: {
          error: null,
        },
      };
      deepFreeze(state);
      expect(hasError(state)).toBeFalsy();
    });
  });
});
