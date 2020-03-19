import React from "react";
import { shallow } from "enzyme";
import Loader from "components/Loader";

describe("components/Loader", () => {
  it("renders", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
