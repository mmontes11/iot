import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import StatsParamsPanel from "containers/statsParamsPanel";
import { TYPE } from "constants/params";
import { initialState, defaultStore } from "../constants";

describe("containers/statsParamsPanel", () => {
  it("renders in initial state", () => {
    const wrapper = shallow(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <StatsParamsPanel onParamsSelected={() => undefined} onReset={() => undefined} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders when TYPE is selected", () => {
    const state = {
      ...initialState,
      params: {
        byId: {
          TYPE: {
            items: ["event", "measurement"],
            isActive: false,
            isLoading: false,
            isDisabled: false,
            selectedItem: "event",
          },
        },
        allIds: [TYPE],
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = shallow(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <StatsParamsPanel onParamsSelected={() => undefined} onReset={() => undefined} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders when loading TYPE", () => {
    const state = {
      ...initialState,
      params: {
        byId: {
          TYPE: {
            items: ["event", "measurement"],
            isActive: false,
            isLoading: true,
            isDisabled: false,
            selectedItem: null,
          },
        },
        allIds: [TYPE],
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = shallow(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <StatsParamsPanel onParamsSelected={() => undefined} onReset={() => undefined} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
