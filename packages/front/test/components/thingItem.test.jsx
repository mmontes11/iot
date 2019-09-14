import React from "react";
import { shallow } from "enzyme";
import ThingItem from "components/thingItem";

describe("components/thingItem", () => {
  const onClick = jest.fn();
  const wrapper = shallow(<ThingItem name="foo" isSelected={false} onClick={onClick} />);
  it("renders when it's not selected", () => {
    expect(wrapper).toMatchSnapshot();
  });
  it("renders when it's selected", () => {
    const wrapperSelected = shallow(<ThingItem name="bar" isSelected onClick={() => undefined} />);
    expect(wrapperSelected).toMatchSnapshot();
  });
  it("simulates a click", () => {
    wrapper
      .find("div")
      .first()
      .simulate("click");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
