import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Main from "components/Main";
import IntlProvider from "containers/IntlProvider";
import { defaultStore } from "../constants";

describe("components/Main", () => {
  it("renders a Main in / path", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/"]} keyLength={0}>
            <Main />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper.find("Things")).toHaveLength(1);
    expect(wrapper.find("Stats")).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a Main in /foo path", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/foo"]} keyLength={0}>
            <Main />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );

    expect(wrapper.find("Things")).toHaveLength(1);
    expect(wrapper.find("Stats")).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a Main in /things path", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/things"]} keyLength={0}>
            <Main />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper.find("Things")).toHaveLength(1);
    expect(wrapper.find("Stats")).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders a Main in /stats path", () => {
    const wrapper = mount(
      <Provider store={defaultStore}>
        <IntlProvider store={defaultStore}>
          <MemoryRouter initialEntries={["/stats"]} keyLength={0}>
            <Main />
          </MemoryRouter>
        </IntlProvider>
      </Provider>,
    );
    expect(wrapper.find("Things")).toHaveLength(0);
    expect(wrapper.find("Stats")).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });
});
