import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FiltersPanel from "components/filtersPanel";
import * as filterActions from "actions/filters";
import * as thingFilterActions from "actions/thingFilter";
import * as dateFilterActions from "actions/dateFilter";
import * as fromState from "reducers";
import { THING_FILTER_TYPE, DATE_FILTER_TYPE } from "constants/filterTypes";
import { TYPE } from "constants/params";

const FiltersPanelContainer = ({
  onFiltersSelected,
  type,
  statsType,
  thingFilter,
  dateFilter,
  selectedFilters,
  selectFilterType,
  addFilterType,
  deleteFilterType,
  selectThingFilter,
  updateThingFilter,
  toggleDateFilterType,
  selectTimePeriod,
  updateTimePeriod,
  updateStartDate,
  updateEndDate,
}) => (
  <FiltersPanel
    type={{
      ...type,
      onButtonClick: () => selectFilterType(),
      onItemClick: item => addFilterType(item),
    }}
    thingFilter={{
      ...thingFilter,
      label: thingFilter.selectedItem || "Thing",
      onButtonClick: () => selectThingFilter(statsType, thingFilter.isActive),
      onItemClick: item => {
        updateThingFilter(item);
        onFiltersSelected(
          item,
          dateFilter.timePeriod.selectedItem,
          dateFilter.custom.startDate,
          dateFilter.custom.endDate,
        );
      },
      onDelete: item => {
        deleteFilterType(item);
        onFiltersSelected();
      },
    }}
    dateFilter={{
      ...dateFilter,
      selector: {
        isCustomSelected: dateFilter.isCustomSelected,
        onChange: () => toggleDateFilterType(),
      },
      timePeriod: {
        ...dateFilter.timePeriod,
        label: dateFilter.timePeriod.selectedItem || "Time period",
        onButtonClick: () => selectTimePeriod(dateFilter.timePeriod.isActive),
        onItemClick: item => {
          updateTimePeriod(item);
          onFiltersSelected(thingFilter.selectedItem, item, dateFilter.custom.startDate, dateFilter.custom.endDate);
        },
      },
      custom: {
        startDate: {
          selected: dateFilter.custom.startDate,
          onChange: date => {
            updateStartDate(date);
            onFiltersSelected(
              thingFilter.selectedItem,
              dateFilter.timePeriod.selectedItem,
              date,
              dateFilter.custom.endDate,
            );
          },
        },
        endDate: {
          selected: dateFilter.custom.endDate,
          onChange: date => {
            updateEndDate(date);
            onFiltersSelected(
              thingFilter.selectedItem,
              dateFilter.timePeriod.selectedItem,
              dateFilter.custom.startDate,
              date,
            );
          },
        },
      },
      onDelete: item => {
        deleteFilterType(item);
        if (item === THING_FILTER_TYPE) {
          onFiltersSelected(
            undefined,
            dateFilter.timePeriod.selectedItem,
            dateFilter.custom.startDate,
            dateFilter.custom.endDate,
          );
        } else if (item === DATE_FILTER_TYPE) {
          onFiltersSelected(thingFilter.selectedItem);
        }
      },
    }}
    selectedFilters={selectedFilters}
  />
);

FiltersPanelContainer.propTypes = {
  onFiltersSelected: PropTypes.func.isRequired,
  type: PropTypes.shape({}).isRequired,
  statsType: PropTypes.string,
  thingFilter: PropTypes.shape({}).isRequired,
  dateFilter: PropTypes.shape({}).isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectFilterType: PropTypes.func.isRequired,
  addFilterType: PropTypes.func.isRequired,
  deleteFilterType: PropTypes.func.isRequired,
  selectThingFilter: PropTypes.func.isRequired,
  updateThingFilter: PropTypes.func.isRequired,
  toggleDateFilterType: PropTypes.func.isRequired,
  selectTimePeriod: PropTypes.func.isRequired,
  updateTimePeriod: PropTypes.func.isRequired,
  updateStartDate: PropTypes.func.isRequired,
  updateEndDate: PropTypes.func.isRequired,
};

FiltersPanelContainer.defaultProps = {
  statsType: null,
};

const withConnect = connect(
  state => ({
    statsType: fromState.getParam(state, TYPE).selectedItem,
    type: state.filters.type,
    thingFilter: state.filters.thingFilter,
    dateFilter: state.filters.dateFilter,
    selectedFilters: state.filters.items,
  }),
  { ...filterActions, ...thingFilterActions, ...dateFilterActions },
);

export default withConnect(FiltersPanelContainer);
