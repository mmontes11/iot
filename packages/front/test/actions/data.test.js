import { getStats } from "actions/data";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { FILTER_TYPES } from "constants/filterTypes";
import { initialState } from "../constants";

describe("actions/data", () => {
  it("dispatches a getStats action for event stats", () => {
    const thunk = getStats();
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      ...initialState,
      stats: {
        ...initialState.stats,
        params: {
          type: { selectedItem: EVENT_TYPE },
          observation: { selectedItem: "door-opened" },
        },
        filters: {
          thingFilter: { selectedItem: "raspi" },
          dateFilter: {
            timePeriod: { selectedItem: "hour" },
            custom: {
              startDate: new Date(),
              endDate: new Date(),
            },
          },
          items: FILTER_TYPES,
        },
      },
    }));
    thunk(dispatch, getState);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a getStats action for measurement stats", () => {
    const thunk = getStats();
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      ...initialState,
      stats: {
        ...initialState.stats,
        params: {
          type: { selectedItem: MEASUREMENT_TYPE },
          observation: { selectedItem: "temperature-outdoor" },
        },
        filters: {
          thingFilter: { selectedItem: "raspi" },
          dateFilter: {
            timePeriod: { selectedItem: "hour" },
            custom: {
              startDate: new Date(),
              endDate: new Date(),
            },
          },
          items: FILTER_TYPES,
        },
      },
    }));
    thunk(dispatch, getState);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
});
