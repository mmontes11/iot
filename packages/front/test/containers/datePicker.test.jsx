import React from "react";
import { shallow } from "enzyme";
import DatePicker from "containers/datePicker";
import IntlProvider from "containers/intlProvider";
import { defaultStore } from "../constants";

describe("components/datePicker", () => {
  it("renders in initial state", () => {
    const wrapper = shallow(
      <IntlProvider store={defaultStore}>
        <DatePicker placeholder="Select date:" selected={undefined} onChange={() => undefined} />
      </IntlProvider>,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
