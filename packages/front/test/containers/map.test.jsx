import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import Map from "containers/map";
import { pointToLatLng } from "helpers/geometry";
import { initialState, defaultStore, thing } from "../constants/index";

describe("containers/map", () => {
  it("renders a map", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <Map />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a map with marker", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <Map marker={{ point: pointToLatLng(thing.geometry) }} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a map with label and marker", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <Map marker={{ label: thing.name, point: pointToLatLng(thing.geometry) }} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a map with open dialog", () => {
    const state = {
      ...initialState,
      app: {
        isMapDialogOpened: true,
      },
    };
    const store = configureStore([thunk])(state);
    const wrapper = mount(
      <Provider store={store}>
        <Map marker={{ label: thing.name, point: pointToLatLng(thing.geometry) }} />
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("returns null when trying to convert an invalid geometry", () => {
    expect(pointToLatLng(null)).toBeNull();
    expect(pointToLatLng({ foo: "bar" })).toBeNull();
  });
});
