import React from "react";
import ThingFilter from "components/thingFilter";
import { shallow } from "enzyme";

describe("components/thingFilter", () => {
  it("renders ThingFilter in initial state", () => {
    const thingFilter = {
      label: "Select filter:",
      items: ["foo", "bar"],
      isActive: false,
      isLoading: false,
      isDisabled: false,
      onButtonClick: () => undefined,
      onItemClick: () => undefined,
      onDelete: () => undefined,
    };
    const wrapper = shallow(<ThingFilter thingFilter={thingFilter} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("simulates a click in delete button", () => {
    const onDelete = jest.fn();
    const thingFilter = {
      label: "Select filter:",
      items: ["foo", "bar"],
      isActive: false,
      isLoading: false,
      isDisabled: false,
      onButtonClick: () => undefined,
      onItemClick: () => undefined,
      onDelete,
    };
    const wrapper = shallow(<ThingFilter thingFilter={thingFilter} />);
    wrapper.find("#delete-button").simulate("click");
    expect(onDelete).toHaveBeenCalled();
  });
});
