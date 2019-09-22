import { isAuth, setUsername, setPassword, login, logout } from "actions/auth";

describe("actions/auth", () => {
  const testThunk = thunk => {
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  };
  it("dispatches an isAuth action", () => {
    testThunk(isAuth());
  });
  it("dispatches a setUsername action", () => {
    testThunk(setUsername());
  });
  it("dispatches a setPassword action", () => {
    testThunk(setPassword());
  });
  it("dispatches a login action", () => {
    const thunk = login();
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      auth: { username: "username", password: "password" },
    }));
    thunk(dispatch, getState);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
  it("dispatches a logout action", () => {
    testThunk(logout());
  });
});
