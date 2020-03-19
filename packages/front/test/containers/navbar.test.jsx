import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Navbar from "containers/Navbar";
import IntlProvider from "containers/IntlProvider";
import { initialState, defaultStore } from "../constants/index";

describe("containers/Navbar", () => {
  it("renders Navbar in initial state and unmounts", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter keyLength={0}>
            <Navbar />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
  it("renders Navbar in toggled hamburguer menu state", () => {
    const state = {
      ...initialState,
      app: {
        isHamburgerMenuExpanded: true,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter keyLength={0}>
            <Navbar />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("simulates a click in logout button", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter keyLength={0}>
            <Navbar />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    const logoutButton = wrapper.find("#logout-button");
    logoutButton.first().simulate("click");
    expect(defaultStore.getState().auth.isAuth).toBeFalsy();
    expect(defaultStore.getState()).toMatchSnapshot();
  });
});
