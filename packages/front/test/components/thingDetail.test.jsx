import React from "react";
import { shallow } from "enzyme";
import ThingDetail from "components/thingDetail";
import IntlProvider from "containers/intlProvider";
import { defaultStore, thing } from "../constants";

describe("components/thingDetail", () => {
  const wrapper = shallow(
    <IntlProvider store={defaultStore}>
      <ThingDetail thing={thing} onEventStatsClick={() => undefined} onMeasurementStatsClick={() => undefined} />
    </IntlProvider>,
  );
  it("renders", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
