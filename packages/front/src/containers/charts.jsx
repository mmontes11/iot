import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "components/loader";
import ChartBox from "components/chartBox";
import BarChart from "components/barChart";
import LineChart from "components/lineChart";
import { BARCHART, LINECHART, REALTIME } from "constants/chartTypes";
import { isEmpty } from "helpers/validation";

const Charts = ({ chartType, items, things, isLoading }) => {
  if (isLoading) {
    return <Loader />;
  }
  switch (chartType) {
    case BARCHART: {
      if (isEmpty(items)) {
        return null;
      }
      return items.map(({ type, unit, data }) => (
        <ChartBox key={type} type={type} unit={unit}>
          <BarChart data={data} />
        </ChartBox>
      ));
    }
    case LINECHART: {
      if (isEmpty(items) || isEmpty(things)) {
        return null;
      }
      return items.map(({ type, unit, items: data }) => (
        <ChartBox key={type} type={type} unit={unit}>
          <LineChart
            data={data}
            lineItems={things}
            lineDataKey={(dataItem, thing) => {
              const thingData = dataItem.values.find(el => el.thing === thing);
              if (thingData) {
                return thingData.value;
              }
              return null;
            }}
          />
        </ChartBox>
      ));
    }
    case REALTIME: {
      if (isEmpty(items)) {
        return null;
      }
      const { type, unit } = items[0];
      return (
        <ChartBox key={type} type={type} unit={unit}>
          <LineChart data={items} lineItems={[type]} lineDataKey={dataItem => dataItem.value} />
        </ChartBox>
      );
    }
    default:
      return null;
  }
};

Charts.propTypes = {
  chartType: PropTypes.oneOf([BARCHART, LINECHART, REALTIME]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string, unit: PropTypes.string })),
  things: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool.isRequired,
};

Charts.defaultProps = {
  items: null,
  things: null,
};

const withConnect = connect(state => ({
  items: state.data.items,
  things: state.data.things,
  isLoading: state.data.isLoading,
}));

export default withConnect(Charts);
