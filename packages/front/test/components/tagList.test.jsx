import React from "react";
import { shallow } from "enzyme";
import TagList from "components/TagList";

describe("components/TagList", () => {
  it("renders nothing when no tags are specified", () => {
    const wrapper = shallow(<TagList label="foo" tagStyle="is-warning" />);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders tags", () => {
    const wrapper = shallow(<TagList tags={["foo", "bar"]} label="foo" tagStyle="is-warning" />);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders tags without label", () => {
    const wrapper = shallow(<TagList tags={["foo", "bar"]} tagStyle="is-warning" />);
    expect(wrapper).toMatchSnapshot();
  });
  it("renders tags without style", () => {
    const wrapper = shallow(<TagList tags={["foo", "bar"]} label="foo" />);
    expect(wrapper).toMatchSnapshot();
  });
});
