import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import Things from "containers/things";
import IntlProvider from "containers/intlProvider";
import { initialState, defaultStore, thing } from "../constants";

describe("containers/things", () => {
  it("renders things in initial state and unmounts", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Things />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });
  it("renders things in loading state", () => {
    const state = {
      ...initialState,
      request: {
        pending: 1,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapperLoading = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Things />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapperLoading).toMatchSnapshot();
  });
  it("renders things with loaded things", () => {
    const state = {
      ...initialState,
      things: {
        items: [thing],
        selectedItem: null,
        shouldShowNotFoundError: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Things />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders things with loaded things and selected thing", () => {
    const state = {
      ...initialState,
      things: {
        items: [thing],
        selectedItem: thing,
        shouldShowNotFoundError: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Things />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("simulates a click in a thing and in its actions", () => {
    const state = {
      ...initialState,
      things: {
        items: [thing],
        selectedItem: thing,
        shouldShowNotFoundError: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Things />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    wrapper
      .find("ThingItem")
      .first()
      .simulate("click");
    expect(wrapper).toMatchSnapshot();
  });
});
