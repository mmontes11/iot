import React from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "react-intl";

const titleForStats = (type, unit, formatMessage) => {
  let title = `${formatMessage({ id: type })}`;
  if (unit) {
    title += ` (${unit.symbol})`;
  }
  return title;
};

const ChartBox = ({ intl: { formatMessage }, type, unit, children }) => (
  <div className="box">
    <div className="columns">
      <div className="column">
        <p className="title is-3 has-text-primary has-text-centered is-spaced">
          {titleForStats(type, unit, formatMessage)}
        </p>
        <div className="chart">{children}</div>
      </div>
    </div>
  </div>
);

ChartBox.propTypes = {
  intl: intlShape.isRequired,
  type: PropTypes.string.isRequired,
  unit: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
  }),
  children: PropTypes.node.isRequired,
};

ChartBox.defaultProps = {
  unit: null,
};

export default injectIntl(ChartBox);
