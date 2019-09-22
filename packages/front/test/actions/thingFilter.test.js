import { selectThingFilter, updateThingFilter } from "actions/thingFilter";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";

describe("actions/thingFilter", () => {
  it("dispatches a selectThingFilter action with all posible params", () => {
    let thunk = selectThingFilter(EVENT_TYPE, true);
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
    thunk = selectThingFilter(EVENT_TYPE, false);
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
    thunk = selectThingFilter(MEASUREMENT_TYPE, true);
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
    thunk = selectThingFilter(MEASUREMENT_TYPE, false);
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a updateThingFilter action", () => {
    const thunk = updateThingFilter();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
});
