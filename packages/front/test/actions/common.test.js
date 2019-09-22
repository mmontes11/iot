import { reset } from "actions/common";

describe("actions/common", () => {
  it("dispatches a reset action", () => {
    const thunk = reset();
    const dispatch = jest.fn();
    thunk(dispatch);
    expect(thunk).toBeAThunk();
    expect(thunk).toMatchSnapshot();
  });
});
