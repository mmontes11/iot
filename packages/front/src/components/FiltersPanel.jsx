import React from "react";
import PropTypes from "prop-types";
import Dropdown from "components/Dropdown";
import ThingFilter from "components/ThingFilter";
import DateFilter from "components/DateFilter";
import { THING_FILTER_TYPE, DATE_FILTER_TYPE } from "constants/filterTypes";

const getFilter = (filterType, thingFilter, dateFilter) => {
  switch (filterType) {
    case THING_FILTER_TYPE:
      return <ThingFilter key={filterType} thingFilter={thingFilter} />;
    case DATE_FILTER_TYPE:
      return <DateFilter key={filterType} dateFilter={dateFilter} />;
    default:
      return null;
  }
};

const FiltersPanel = ({ type, selectedFilters, thingFilter, dateFilter }) => (
  <div className="box">
    <div className="columns">
      <div className="column">
        <Dropdown {...type} label="Filters" buttonStyle="is-primary" iconStyle="fa-plus" isLoading={false} />
      </div>
    </div>
    {selectedFilters.map(filterType => getFilter(filterType, thingFilter, dateFilter))}
  </div>
);

FiltersPanel.propTypes = {
  type: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    isActive: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
  }).isRequired,
  thingFilter: PropTypes.shape({}).isRequired,
  dateFilter: PropTypes.shape({}).isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FiltersPanel;
