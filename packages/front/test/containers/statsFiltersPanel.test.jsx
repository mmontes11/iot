import React from "react";
import { shallow } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import FiltersPanelContainer from "containers/filtersPanelContainer";
import { defaultStore } from "../constants";

describe("containers/statFiltersPanel", () => {
  it("renders in in initial state", () => {
    const wrapper = shallow(
      <Provider store={defaultStore}>
        <MemoryRouter initialEntries={["/"]} keyLength={0}>
          <FiltersPanelContainer onFiltersChange={() => undefined} />
        </MemoryRouter>
      </Provider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
