import React from "react";
import PropTypes from "prop-types";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colorForIndex } from "helpers/chart";
import { injectIntl, intlShape } from "react-intl";

const BarChart = ({ intl: { formatMessage, formatNumber }, data }) => {
  if (data === null || data.length === 0) {
    return null;
  }
  const dataElement = data[0];
  const thingKey = "thing";
  const barKeys = Object.keys(dataElement).filter(key => key !== thingKey);
  return (
    <ResponsiveContainer>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={thingKey} />
        <YAxis tickFormatter={tick => formatNumber(tick)} />
        <Tooltip formatter={value => formatNumber(value)} />
        <Legend />
        {barKeys.map((barKey, index) => (
          <Bar
            key={barKey}
            name={formatMessage({ id: barKey, defaultMessage: barKey })}
            dataKey={barKey}
            fill={colorForIndex(index)}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

BarChart.propTypes = {
  intl: intlShape.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

BarChart.defaultProps = {
  data: null,
};

export default injectIntl(BarChart);
