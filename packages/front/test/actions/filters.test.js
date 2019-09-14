import { selectFilterType, addFilterType, deleteFilterType } from "actions/filters";

describe("actions/filters", () => {
  it("dispatches a selectFilterType action", () => {
    const thunk = selectFilterType();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a addFilterType action", () => {
    const thunk = addFilterType();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a deleteFilterType action", () => {
    const thunk = deleteFilterType();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
});
