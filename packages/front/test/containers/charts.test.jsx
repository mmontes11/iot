import React from "react";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import Charts from "containers/Charts";
import { BARCHART, LINECHART } from "constants/chartTypes";
import { initialState, defaultStore, statsItem, eventDataItem, measurementDataItem } from "../constants";

describe("containers/Charts", () => {
  it("renders nothing", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <Charts charType="foo" />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders when loading", () => {
    const state = {
      ...initialState,
      data: {
        items: [],
        things: [],
        isLoading: true,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <Charts charType={BARCHART} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a bar chart", () => {
    const state = {
      ...initialState,
      data: {
        items: [statsItem],
        things: [],
        isLoading: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <Charts charType={BARCHART} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a line chart of event data", () => {
    const state = {
      ...initialState,
      data: {
        items: [eventDataItem],
        things: [],
        isLoading: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <Charts charType={LINECHART} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a line chart of measurement data", () => {
    const state = {
      ...initialState,
      data: {
        items: [measurementDataItem],
        things: ["foo", "bar"],
        isLoading: false,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <Charts charType={LINECHART} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
