import React from "react";
import { shallow } from "enzyme";
import ThingDetail from "components/ThingDetail";
import IntlProvider from "containers/IntlProvider";
import { defaultStore, thing } from "../constants";

describe("components/ThingDetail", () => {
  const wrapper = shallow(
    <IntlProvider store={defaultStore}>
      <ThingDetail thing={thing} onEventStatsClick={() => undefined} onMeasurementStatsClick={() => undefined} />
    </IntlProvider>,
  );
  it("renders", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
