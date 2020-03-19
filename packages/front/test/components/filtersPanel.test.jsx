import React from "react";
import { shallow } from "enzyme";
import FiltersPanel from "components/FiltersPanel";
import { FILTER_TYPES } from "constants/filterTypes";

describe("components/FiltersPanel", () => {
  it("renders with no filters", () => {
    const wrapper = shallow(
      <FiltersPanel
        type={{
          items: ["foo", "bar"],
          isActive: false,
          onButtonClick: () => undefined,
          onItemClick: () => undefined,
        }}
        thingFilter={{
          label: "Select filter:",
          items: ["foo", "bar"],
          isActive: false,
          isLoading: false,
          isDisabled: false,
          onButtonClick: () => undefined,
          onItemClick: () => undefined,
          onDelete: () => undefined,
        }}
        dateFilter={{
          selector: {
            isCustomSelected: false,
            onChange: () => undefined,
          },
          timePeriod: {
            label: "Select time period:",
            isLoading: false,
            isActive: true,
            isDisabled: false,
            items: ["foo", "bar"],
            selectedItem: null,
            onButtonClick: () => undefined,
            onItemClick: () => undefined,
          },
          custom: {
            startDate: {
              selected: null,
              onChange: () => undefined,
            },
            endDate: {
              selected: null,
              onChange: () => undefined,
            },
          },
          onDelete: () => undefined,
        }}
        selectedFilters={["foo"]}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders with filters", () => {
    const wrapper = shallow(
      <FiltersPanel
        type={{
          items: ["foo", "bar"],
          isActive: false,
          onButtonClick: () => undefined,
          onItemClick: () => undefined,
        }}
        thingFilter={{
          label: "Select filter:",
          items: ["foo", "bar"],
          isActive: false,
          isLoading: false,
          isDisabled: false,
          onButtonClick: () => undefined,
          onItemClick: () => undefined,
          onDelete: () => undefined,
        }}
        dateFilter={{
          selector: {
            isCustomSelected: false,
            onChange: () => undefined,
          },
          timePeriod: {
            label: "Select time period:",
            isLoading: false,
            isActive: true,
            isDisabled: false,
            items: ["foo", "bar"],
            selectedItem: null,
            onButtonClick: () => undefined,
            onItemClick: () => undefined,
          },
          custom: {
            startDate: {
              selected: null,
              onChange: () => undefined,
            },
            endDate: {
              selected: null,
              onChange: () => undefined,
            },
          },
          onDelete: () => undefined,
        }}
        selectedFilters={FILTER_TYPES}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
