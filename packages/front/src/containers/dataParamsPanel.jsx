import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ParamsPanel from "components/paramsPanel";
import * as paramsActions from "actions/params";
import * as fromState from "reducers";
import { TYPE, OBSERVATION, GROUP_BY } from "constants/params";
import { isParamDisabled } from "helpers/paramsPanel";
import { paramShape } from "types";

const DataParamsPanel = ({
  onParamsSelected,
  onReset,
  type,
  observation,
  groupBy,
  isResetDisabled,
  selectType,
  updateType,
  selectObservation,
  updateObservation,
  selectGroupBy,
  updateGroupBy,
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
          onParamsSelected(type.selectedItem, item, groupBy.selectedItem);
        },
      },
      {
        key: GROUP_BY,
        label: groupBy.selectedItem || "Group by",
        items: groupBy.items || [],
        isActive: groupBy.isActive || false,
        isLoading: groupBy.isLoading || false,
        isDisabled: groupBy.isDisabled || false,
        onButtonClick: () => selectGroupBy(),
        onItemClick: item => {
          updateGroupBy(item);
          onParamsSelected(type.selectedItem, observation.selectedItem, item);
        },
      },
    ]}
    reset={{
      isDisabled: isResetDisabled,
      onReset: () => onReset(),
    }}
  />
);

DataParamsPanel.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  type: paramShape.isRequired,
  observation: paramShape.isRequired,
  groupBy: paramShape.isRequired,
  isResetDisabled: PropTypes.bool.isRequired,
  selectType: PropTypes.func.isRequired,
  updateType: PropTypes.func.isRequired,
  selectObservation: PropTypes.func.isRequired,
  updateObservation: PropTypes.func.isRequired,
  selectGroupBy: PropTypes.func.isRequired,
  updateGroupBy: PropTypes.func.isRequired,
};

const withConnect = connect(
  state => ({
    type: fromState.getParam(state, TYPE),
    observation: fromState.getParam(state, OBSERVATION),
    groupBy: fromState.getParam(state, GROUP_BY),
    isResetDisabled: fromState.isResetDisabled(state),
  }),
  { ...paramsActions },
);

export default withConnect(DataParamsPanel);
