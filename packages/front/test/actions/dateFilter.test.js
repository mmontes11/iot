import {
  toggleDateFilterType,
  selectTimePeriod,
  updateTimePeriod,
  updateStartDate,
  updateEndDate,
} from "actions/dateFilter";

describe("actions/dateFilter", () => {
  it("dispatches toggleDateFilterType action", () => {
    const thunk = toggleDateFilterType();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches selectTimePeriod action", () => {
    const thunk = selectTimePeriod();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches updateTimePeriod action", () => {
    const thunk = updateTimePeriod();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches updateStartDate action", () => {
    const thunk = updateStartDate();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches updateEndDate action", () => {
    const thunk = updateEndDate();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
});
