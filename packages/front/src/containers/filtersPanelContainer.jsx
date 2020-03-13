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
import { paramShape, dateFilterShape } from "types";

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
}) => {
  const onDeleteFilter = item => {
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
  };
  return (
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
        onDelete: onDeleteFilter,
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
        onDelete: onDeleteFilter,
      }}
      selectedFilters={selectedFilters}
    />
  );
};

FiltersPanelContainer.propTypes = {
  onFiltersSelected: PropTypes.func.isRequired,
  type: PropTypes.shape({}).isRequired,
  statsType: PropTypes.string,
  thingFilter: paramShape.isRequired,
  dateFilter: dateFilterShape.isRequired,
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
