import React from "react";
import propTypes from "prop-types";
import classNames from "classnames";

const ThingItem = ({ name, isSelected, onClick }) => {
  const cardClass = classNames("thing-item-card", { "is-selected": isSelected });
  return (
    <div className={cardClass} onClick={onClick} onKeyPress={onClick} role="button" tabIndex={0}>
      <div className="card-content">
        <div className="content">
          <p className="title is-6">{name}</p>
        </div>
      </div>
    </div>
  );
};

ThingItem.propTypes = {
  name: propTypes.string.isRequired,
  isSelected: propTypes.bool.isRequired,
  onClick: propTypes.func.isRequired,
};

export default ThingItem;
