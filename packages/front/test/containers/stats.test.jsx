import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import Stats from "containers/stats";
import IntlProvider from "containers/intlProvider";
import { initialState, defaultStore, statsWithUnits, statsWithoutUnits } from "../constants";

describe("containers/stats", () => {
  it("renders stats in initial state", () => {
    const wrapperLoading = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Stats />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapperLoading).toMatchSnapshot();
  });
  it("renders when loading stats", () => {
    const state = {
      ...initialState,
      request: {
        pending: 1,
        statusCode: null,
        error: null,
      },
      data: {
        ...initialState.data,
        isLoading: true,
        items: [],
      },
    };
    const store = configureStore([thunk])(state);
    const wrapperLoading = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Stats />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapperLoading).toMatchSnapshot();
  });
  it("renders stats", () => {
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        isLoading: false,
        items: [statsWithUnits, statsWithoutUnits],
      },
    };
    const store = configureStore([thunk])(state);
    const wrapperLoading = mount(
      <Provider store={store}>
        <IntlProvider store={store}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Stats />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapperLoading).toMatchSnapshot();
  });
});
