import React from "react";
import PropTypes from "prop-types";
import Dropdown from "components/dropdown";
import { THING_FILTER_TYPE } from "constants/filterTypes";
import { FormattedMessage } from "react-intl";

const ThingFilter = ({ thingFilter }) => (
  <div className="box">
    <div className="columns">
      <div className="column is-10">
        <Dropdown
          {...thingFilter}
          iconStyle="fa-angle-down"
          onButtonClick={() => thingFilter.onButtonClick()}
          onItemClick={item => thingFilter.onItemClick(item)}
        />
      </div>
      <div className="column is-center">
        <button
          id="delete-button"
          className="delete is-medium"
          onClick={() => thingFilter.onDelete(THING_FILTER_TYPE)}
          tabIndex={0}
        >
          <FormattedMessage id="Delete" />
        </button>
      </div>
    </div>
  </div>
);

ThingFilter.propTypes = {
  thingFilter: PropTypes.shape({
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isActive: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
};

export default ThingFilter;
