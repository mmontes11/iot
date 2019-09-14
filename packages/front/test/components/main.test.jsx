import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Main from "components/main";
import IntlProvider from "containers/intlProvider";
import { defaultStore } from "../constants";

describe("components/main", () => {
  it("renders a main in / path", () => {
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
  it("renders a main in /foo path", () => {
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
  it("renders a main in /things path", () => {
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
  it("renders a main in /stats path", () => {
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
