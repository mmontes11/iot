import { FILTER_TYPE_SELECT, ADD_FILTER_TYPE, DELETE_FILTER_TYPE } from "constants/actionTypes/filters";
import { RESET } from "constants/actionTypes/common";
import { THING_FILTER_TYPE, DATE_FILTER_TYPE, FILTER_TYPES } from "constants/filterTypes";
import thingFilterReducer, { initialState as thingFilterInitialState } from "reducers/thingFilter";
import dateFilterReducer, { initialState as dateFilterInitialState } from "reducers/dateFilter";

export const initialState = {
  type: {
    items: FILTER_TYPES,
    isActive: false,
    isDisabled: false,
  },
  thingFilter: thingFilterInitialState,
  dateFilter: dateFilterInitialState,
  items: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FILTER_TYPE_SELECT:
      return { ...state, type: { ...state.type, isActive: !state.type.isActive } };
    case ADD_FILTER_TYPE: {
      const { addedFilterType } = action;
      const addedItems = [...state.items];
      if (!addedItems.includes(addedFilterType)) {
        addedItems.push(addedFilterType);
      }
      const filterTypeItems = state.type.items.filter(item => !addedItems.includes(item));
      const allItemsSelected = FILTER_TYPES.every(item => addedItems.includes(item));
      return {
        ...state,
        type: {
          ...state.type,
          items: filterTypeItems,
          isActive: false,
          isDisabled: allItemsSelected,
        },
        items: addedItems,
      };
    }
    case DELETE_FILTER_TYPE: {
      const { deletedFilterType } = action;
      const addedItems = [...state.items];
      const newItems = addedItems.filter(item => item !== deletedFilterType);
      const filterTypeItems = [...state.type.items];
      if (!filterTypeItems.includes(deletedFilterType)) {
        filterTypeItems.push(deletedFilterType);
      }
      const allItemsSelected = FILTER_TYPES.every(item => newItems.includes(item));
      const nextState = {
        ...state,
        type: {
          ...state.type,
          items: filterTypeItems,
          isDisabled: allItemsSelected,
        },
        items: newItems,
      };
      if (deletedFilterType === THING_FILTER_TYPE) {
        return {
          ...nextState,
          thingFilter: thingFilterInitialState,
        };
      } else if (deletedFilterType === DATE_FILTER_TYPE) {
        return {
          ...nextState,
          dateFilter: dateFilterInitialState,
        };
      }
      return nextState;
    }
    case RESET:
      return initialState;
    default:
      return {
        ...state,
        thingFilter: thingFilterReducer(state.thingFilter, action),
        dateFilter: dateFilterReducer(state.dateFilter, action),
      };
  }
};
