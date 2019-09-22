import { selectType, updateType, selectObservation, updateObservation } from "actions/params";
import { EVENT_TYPE, MEASUREMENT_TYPE } from "constants/observationTypes";
import { OBSERVATION } from "constants/params";

describe("actions/params", () => {
  const testThunk = thunk => {
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  };
  it("dispatches a selectType action", () => {
    testThunk(selectType());
  });
  it("dispatches a updateType action", () => {
    let thunk = updateType(EVENT_TYPE);
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
    thunk = updateType(MEASUREMENT_TYPE);
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a selectObservation action", () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      params: {
        byId: {
          OBSERVATION: {
            selectedItem: MEASUREMENT_TYPE,
          },
        },
        allIds: [OBSERVATION],
      },
    }));
    const thunk = selectObservation(dispatch, getState);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a updateObservation action", () => {
    testThunk(updateObservation());
  });
});
