import React from "react";
import PropTypes from "prop-types";
import Dropdown from "components/Dropdown";
import { FormattedMessage } from "react-intl";

const ParamsPanel = ({ params, reset }) => (
  <div className="box">
    <div className="columns">
      {params.map(param => {
        const { key, label, items, isActive, isLoading, isDisabled, onButtonClick, onItemClick } = param;
        return (
          <div key={key} className="column">
            <Dropdown
              label={label}
              items={items}
              isActive={isActive}
              isLoading={isLoading}
              isDisabled={isDisabled}
              onButtonClick={() => onButtonClick()}
              onItemClick={item => onItemClick(item)}
            />
          </div>
        );
      })}
      <div className="column is-2">
        <button
          type="button"
          className="button is-warning is-fullwidth"
          disabled={reset.isDisabled}
          onClick={() => reset.onReset()}
        >
          <FormattedMessage id="Reset" />
          <span className="icon is-small">
            <i className="fas fa-eraser" aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  </div>
);

const paramShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  iconStyle: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
});

ParamsPanel.propTypes = {
  params: PropTypes.arrayOf(paramShape).isRequired,
  reset: PropTypes.shape({
    isDisabled: PropTypes.bool.isRequired,
    onReset: PropTypes.func.isRequired,
  }).isRequired,
};

export default ParamsPanel;
