import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ParamsPanel from "components/paramsPanel";
import { THING, TYPE } from "constants/params";
import * as paramsActions from "actions/params";
import * as fromState from "reducers";
import { thingShape, paramShape } from "types";
import { isParamDisabled } from "../helpers/paramsPanel";

const RealTimeParamsPanel = ({
  onParamsSelected,
  onReset,
  thing,
  type,
  isResetDisabled,
  selectThing,
  updateThing,
  selectMeasurementType,
  updateMeasurementType,
}) => (
  <ParamsPanel
    params={[
      {
        key: "thing",
        label: thing.selectedItem || "Thing",
        items: (thing.items && thing.items.map(t => t.name)) || [],
        isActive: thing.isActive || false,
        isLoading: thing.isLoading || false,
        isDisabled: thing.isDisabled || false,
        onButtonClick: () => selectThing(),
        onItemClick: item => updateThing(item),
      },
      {
        key: "measurement-type",
        label: type.selectedItem || "Measurement type",
        items: type.items || [],
        isActive: type.isActive || false,
        isLoading: type.isLoading || false,
        isDisabled: isParamDisabled(type),
        onButtonClick: () => selectMeasurementType(),
        onItemClick: item => {
          updateMeasurementType(item);
          onParamsSelected(thing.selectedItem, item);
        },
      },
    ]}
    reset={{
      isDisabled: isResetDisabled,
      onReset: () => onReset(),
    }}
  />
);

RealTimeParamsPanel.propTypes = {
  onParamsSelected: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  thing: thingShape.isRequired,
  type: paramShape.isRequired,
  isResetDisabled: PropTypes.bool.isRequired,
  selectThing: PropTypes.func.isRequired,
  updateThing: PropTypes.func.isRequired,
  selectMeasurementType: PropTypes.func.isRequired,
  updateMeasurementType: PropTypes.func.isRequired,
};

const withConnect = connect(
  state => ({
    thing: fromState.getParam(state, THING),
    type: fromState.getParam(state, TYPE),
    isResetDisabled: fromState.isResetDisabled(state),
  }),
  { ...paramsActions },
);

export default withConnect(RealTimeParamsPanel);
