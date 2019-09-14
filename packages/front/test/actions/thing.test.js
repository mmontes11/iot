import { getThings, selectThing } from "actions/things";

describe("actions/auth", () => {
  const testThunk = thunk => {
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  };
  it("dispatches a getThings action", () => {
    testThunk(getThings());
  });
  it("dispatches a selectThing action", () => {
    testThunk(selectThing());
  });
});
