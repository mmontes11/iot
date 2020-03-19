import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";

const Dropdown = ({
  label,
  buttonStyle,
  iconStyle,
  items,
  isActive,
  isLoading,
  isDisabled,
  onButtonClick,
  onItemClick,
}) => {
  const dropdownClass = classNames("dropdown", { "is-active": isActive });
  const buttonClass = classNames("button", buttonStyle, { "is-loading": isLoading });
  const iconClass = classNames("fas", iconStyle);
  return (
    <div className={dropdownClass}>
      <div className="dropdown-trigger">
        <button
          type="button"
          className={buttonClass}
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => onButtonClick()}
          disabled={isDisabled}
        >
          <span>
            <FormattedMessage id={label} defaultMessage={label} />
          </span>
          <span className="icon is-small">
            <i className={iconClass} aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {items &&
            items.map(item => (
              <div
                key={item}
                className="dropdown-item"
                onClick={() => {
                  onItemClick(item);
                }}
                onKeyPress={() => onItemClick(item)}
                role="button"
                tabIndex={0}
              >
                <FormattedMessage id={item} defaultMessage={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  buttonStyle: PropTypes.string,
  iconStyle: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  buttonStyle: "",
  iconStyle: "fa-angle-down",
};

export default Dropdown;
