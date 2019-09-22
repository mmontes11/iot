import expect from "expect";

expect.extend({
  toBeAnAction(received) {
    const pass = received && typeof received === "object" && received.type && typeof received.type === "string";
    return pass
      ? {
          message: () => `expected ${received} to be an action`,
          pass: true,
        }
      : {
          message: () => `expected ${received} not to be an action`,
          pass: false,
        };
  },
  toBeAThunk(received) {
    const pass = received && typeof received === "function" && received.length > 0;
    return pass
      ? {
          message: () => `expected ${received} to be a thunk`,
          pass: true,
        }
      : {
          message: () => `expected ${received} not to be a thunk`,
          pass: false,
        };
  },
});
