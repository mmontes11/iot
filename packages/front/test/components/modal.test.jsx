import React from "react";
import { shallow } from "enzyme";
import Modal from "components/Modal";

describe("components/Modal", () => {
  const onCloseClick = jest.fn();
  const wrapper = shallow(
    <Modal isActive onCloseClick={onCloseClick} messageStyle="is-info" title="Test" subTitle="Test" />,
  );
  it("renders when is active", () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(".modal").hasClass("is-active")).toBeTruthy();
    expect(wrapper.find(".message").hasClass("is-info")).toBeTruthy();
  });
  it("simulates a click in closing button", () => {
    wrapper.find(".modal-close").simulate("click");
    expect(onCloseClick).toHaveBeenCalledTimes(1);
  });
});
