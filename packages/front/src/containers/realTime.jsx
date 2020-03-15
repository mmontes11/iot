import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { handleDataParams } from "hocs/dataParams";
import store from "config/store";
import RealTimeParamsPanel from "containers/realTimeParamsPanel";
import { startRealTimeData, finishRealTimeData, resetData } from "actions/data";
import { reset } from "actions/common";
import Charts from "containers/charts";
import { REALTIME } from "constants/chartTypes";
import { THING, TYPE } from "constants/params";

const RealTime = ({ onParamsSelected, onReset }) => {
  useEffect(() => () => store.dispatch(finishRealTimeData()), []);
  return (
    <div className="container is-fluid section">
      <div className="columns is-centered">
        <div className="column is-three-quarters">
          <RealTimeParamsPanel onParamsSelected={onParamsSelected} onReset={onReset} />
          <Charts chartType={REALTIME} />
        </div>
      </div>
    </div>
  );
};

RealTime.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const withDataParams = handleDataParams({
  path: "real-time",
  pathParams: [
    {
      id: THING,
    },
    {
      id: TYPE,
    },
  ],
  queryParams: [],
  getData: () => {
    store.dispatch(resetData());
    store.dispatch(startRealTimeData());
  },
  reset: () => {
    store.dispatch(reset());
    store.dispatch(finishRealTimeData());
  },
});

export default withDataParams(RealTime);
