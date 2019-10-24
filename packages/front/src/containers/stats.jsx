import React from "react";
import PropTypes from "prop-types";
import { handleDataParams } from "hocs/dataParams";
import store from "config/store";
import { getStats } from "actions/data";
import { reset } from "actions/common";
import StatsParamsPanel from "containers/statsParamsPanel";
import FiltersPanelContainer from "containers/filtersPanelContainer";
import Charts from "containers/charts";
import { BARCHART } from "constants/chartTypes";
import { TYPE, OBSERVATION, THING, START_DATE, END_DATE, TIME_PERIOD } from "constants/params";
import { defaultTimePeriodFilter } from "config/params";

const Stats = ({ onParamsSelected, onFiltersSelected, onReset }) => (
  <div className="container is-fluid section">
    <div className="columns">
      <div className="column is-three-quarters">
        <StatsParamsPanel onParamsSelected={onParamsSelected} onReset={onReset} />
        <Charts chartType={BARCHART} />
      </div>
      <div className="column is-one-quarter">
        <FiltersPanelContainer onFiltersSelected={onFiltersSelected} />
      </div>
    </div>
  </div>
);

Stats.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onFiltersSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const withDataParams = handleDataParams({
  path: "stats",
  pathParams: [
    {
      id: TYPE,
    },
    {
      id: OBSERVATION,
    },
  ],
  queryParams: [
    {
      id: THING,
    },
    {
      id: START_DATE,
    },
    {
      id: END_DATE,
    },
    {
      id: TIME_PERIOD,
      defaultValue: defaultTimePeriodFilter,
    },
  ],
  getData: () => store.dispatch(getStats()),
  reset: () => store.dispatch(reset()),
});

export default withDataParams(Stats);
