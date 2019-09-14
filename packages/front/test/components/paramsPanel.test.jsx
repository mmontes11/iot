import React from "react";
import ParamsPanel from "components/paramsPanel";
import { shallow } from "enzyme";

describe("components/paramsPanel", () => {
  it("renders with some params", () => {
    const wrapper = shallow(
      <ParamsPanel
        params={[
          {
            key: "type",
            label: "Select type",
            items: ["foo", "bar"],
            isActive: false,
            isLoading: false,
            isDisabled: false,
            onButtonClick: () => undefined,
            onItemClick: () => undefined,
          },
          {
            key: "observation",
            label: "Select observation",
            items: ["foo", "bar"],
            isActive: false,
            isLoading: false,
            isDisabled: false,
            onButtonClick: () => undefined,
            onItemClick: () => undefined,
          },
          {
            key: "groupBy",
            label: "Group by",
            items: ["foo", "bar"],
            isActive: false,
            isLoading: false,
            isDisabled: false,
            onButtonClick: () => undefined,
            onItemClick: () => undefined,
          },
        ]}
        reset={{
          isDisabled: true,
          onReset: () => undefined,
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
