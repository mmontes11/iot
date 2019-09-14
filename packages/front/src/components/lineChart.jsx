import React from "react";
import PropTypes from "prop-types";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { colorForIndex } from "helpers/chart";
import { injectIntl, intlShape } from "react-intl";
import { formatDateTime } from "helpers/date";
import { isEmpty } from "helpers/validation";

const axisProps = {
  axisLine: false,
  tickLine: false,
};

const LineChart = ({ intl: { formatMessage, formatNumber, formatDate, formatTime }, data, lineItems, lineDataKey }) => {
  if (isEmpty(data) || isEmpty(lineItems)) {
    return null;
  }
  return (
    <ResponsiveContainer>
      <RechartsLineChart data={data}>
        <XAxis
          dataKey="phenomenonTime"
          tickFormatter={tick => formatDateTime(tick, formatDate, formatTime)}
          {...axisProps}
        />
        <YAxis {...axisProps} tickFormatter={tick => formatNumber(tick)} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          labelFormatter={label => formatDateTime(label, formatDate, formatTime)}
          formatter={value => formatNumber(value)}
        />
        <Legend />
        {lineItems.map((lineItem, index) => (
          <Line
            key={lineItem}
            name={formatMessage({ id: lineItem, defaultMessage: lineItem })}
            type="monotone"
            strokeWidth={3}
            dot={false}
            dataKey={dataItem => lineDataKey(dataItem, lineItem)}
            stroke={colorForIndex(index)}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

LineChart.propTypes = {
  intl: intlShape.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  lineItems: PropTypes.arrayOf(PropTypes.string),
  lineDataKey: PropTypes.func.isRequired,
};

LineChart.defaultProps = {
  data: null,
  lineItems: null,
};

export default injectIntl(LineChart);
