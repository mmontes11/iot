import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ParamsPanel from "components/ParamsPanel";
import * as paramsActions from "actions/params";
import * as fromState from "reducers";
import { TYPE, OBSERVATION } from "constants/params";
import { isParamDisabled } from "helpers/paramsPanel";
import { paramShape } from "types";

const StatsParamsPanel = ({
  onParamsSelected,
  onReset,
  type,
  observation,
  isResetDisabled,
  selectType,
  updateType,
  selectObservation,
  updateObservation,
}) => (
  <ParamsPanel
    params={[
      {
        key: TYPE,
        label: type.selectedItem || "Type",
        items: type.items || [],
        isActive: type.isActive || false,
        isLoading: type.isLoading || false,
        isDisabled: type.isDisabled || false,
        onButtonClick: () => selectType(),
        onItemClick: item => updateType(item),
      },
      {
        key: OBSERVATION,
        label: observation.selectedItem || "Observation",
        items: observation.items || [],
        isActive: observation.isActive || false,
        isLoading: observation.isLoading || false,
        isDisabled: isParamDisabled(observation),
        onButtonClick: () => selectObservation(),
        onItemClick: item => {
          updateObservation(item);
          onParamsSelected(type.selectedItem, item);
        },
      },
    ]}
    reset={{
      isDisabled: isResetDisabled,
      onReset: () => onReset(),
    }}
  />
);

StatsParamsPanel.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  type: paramShape.isRequired,
  observation: paramShape.isRequired,
  isResetDisabled: PropTypes.bool.isRequired,
  selectType: PropTypes.func.isRequired,
  updateType: PropTypes.func.isRequired,
  selectObservation: PropTypes.func.isRequired,
  updateObservation: PropTypes.func.isRequired,
};

const withConnect = connect(
  state => ({
    type: fromState.getParam(state, TYPE),
    observation: fromState.getParam(state, OBSERVATION),
    isResetDisabled: fromState.isResetDisabled(state),
  }),
  { ...paramsActions },
);

export default withConnect(StatsParamsPanel);
