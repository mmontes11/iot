import React from "react";
import PropTypes from "prop-types";
import { handleDataParams } from "hocs/dataParams";
import store from "config/store";
import { getData } from "actions/data";
import { reset } from "actions/common";
import DataParamsPanel from "containers/DataParamsPanel";
import FiltersPanelContainer from "containers/FiltersPanelContainer";
import Charts from "containers/Charts";
import { LINECHART } from "constants/chartTypes";
import { TYPE, OBSERVATION, GROUP_BY, THING, START_DATE, END_DATE, TIME_PERIOD } from "constants/params";
import { defaultTimePeriodFilter, defaultGroupBy } from "config/params";

const Data = ({ onParamsSelected, onFiltersSelected, onReset }) => (
  <div className="container is-fluid section">
    <div className="columns">
      <div className="column is-three-quarters">
        <DataParamsPanel onParamsSelected={onParamsSelected} onReset={onReset} />
        <Charts chartType={LINECHART} />
      </div>
      <div className="column is-one-quarter">
        <FiltersPanelContainer onFiltersSelected={onFiltersSelected} />
      </div>
    </div>
  </div>
);

Data.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onFiltersSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const withDataParams = handleDataParams({
  path: "data",
  pathParams: [
    {
      id: TYPE,
    },
    {
      id: OBSERVATION,
    },
    {
      id: GROUP_BY,
      defaultValue: defaultGroupBy,
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
  getData: () => store.dispatch(getData()),
  reset: () => store.dispatch(reset()),
});

export default withDataParams(Data);
