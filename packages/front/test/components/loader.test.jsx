import React from "react";
import { shallow } from "enzyme";
import Loader from "components/loader";

describe("components/loader", () => {
  it("renders", () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
