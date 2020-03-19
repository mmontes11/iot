import React from "react";
import { shallow } from "enzyme";
import BarChart from "components/BarChart";
import IntlProvider from "containers/IntlProvider";
import { defaultStore, statsWithUnits, statsWithoutUnits } from "../constants";

describe("components/BarChart", () => {
  it("renders chart with units in title", () => {
    const wrapper = shallow(
      <IntlProvider store={defaultStore}>
        <BarChart {...statsWithUnits} />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders chart without units in title", () => {
    const wrapper = shallow(
      <IntlProvider store={defaultStore}>
        <BarChart {...statsWithoutUnits} />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
