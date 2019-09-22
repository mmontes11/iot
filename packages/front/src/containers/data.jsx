import React from "react";
import PropTypes from "prop-types";
import { handleDataParams } from "hocs/dataParams";
import store from "config/store";
import { getData } from "actions/data";
import { reset } from "actions/common";
import DataParamsPanel from "containers/dataParamsPanel";
import FiltersPanelContainer from "containers/filtersPanelContainer";
import Charts from "containers/charts";
import { LINECHART } from "constants/chartTypes";
import { TYPE, OBSERVATION, GROUPBY } from "constants/params";

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

const withDataParams = handleDataParams(
  "data",
  [TYPE, OBSERVATION, GROUPBY],
  () => store.dispatch(getData()),
  () => store.dispatch(reset()),
);

export default withDataParams(Data);
