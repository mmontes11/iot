import React from "react";
import { mount } from "enzyme";
import Dropdown from "components/dropdown";
import IntlProvider from "containers/intlProvider";
import { defaultStore } from "../constants";

describe("components/dropdown", () => {
  it("renders in initial state", () => {
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive={false}
          isLoading={false}
          isDisabled={false}
          onButtonClick={() => undefined}
          onItemClick={() => undefined}
        />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders in active state", () => {
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive
          isLoading={false}
          isDisabled={false}
          onButtonClick={() => undefined}
          onItemClick={() => undefined}
        />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(".dropdown").hasClass("is-active")).toBeTruthy();
  });
  it("renders in loading state", () => {
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive={false}
          isLoading
          isDisabled={false}
          onButtonClick={() => undefined}
          onItemClick={() => undefined}
        />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(".button").hasClass("is-loading")).toBeTruthy();
  });
  it("renders in disabled state", () => {
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive={false}
          isLoading={false}
          isDisabled
          onButtonClick={() => undefined}
          onItemClick={() => undefined}
        />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(".button").prop("disabled")).toBeTruthy();
  });
  it("simulates a click in button", () => {
    const onButtonClick = jest.fn();
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive={false}
          isLoading={false}
          isDisabled={false}
          onButtonClick={onButtonClick}
          onItemClick={() => undefined}
        />
      </IntlProvider>,
    );
    wrapper.find(".button").simulate("click");
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
  it("simulates a click in an item", () => {
    const onClick = jest.fn();
    const wrapper = mount(
      <IntlProvider store={defaultStore}>
        <Dropdown
          label="Select item"
          items={["foo", "bar"]}
          isActive={false}
          isLoading={false}
          isDisabled={false}
          onButtonClick={onClick}
          onItemClick={onClick}
        />
      </IntlProvider>,
    );
    const dropdownItem = wrapper.find(".dropdown-item").first();
    dropdownItem.simulate("click");
    dropdownItem.simulate("keypress", { key: "a" });
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
