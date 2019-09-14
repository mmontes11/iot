import { toggleHamburgerMenu, toggleMapDialog, setShowError } from "actions/app";

describe("actions/auth", () => {
  const testThunk = thunk => {
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  };
  it("dispatches a toggleHamburgerMenu action", () => {
    testThunk(toggleHamburgerMenu());
  });
  it("dispatches a toggleMapDialog action", () => {
    testThunk(toggleMapDialog());
  });
  it("dispatches a setShowError action", () => {
    testThunk(setShowError());
  });
});
