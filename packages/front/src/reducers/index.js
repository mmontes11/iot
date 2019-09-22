import { combineReducers } from "redux";
import app from "reducers/app";
import request, * as fromRequest from "reducers/request";
import auth from "reducers/auth";
import things from "reducers/things";
import params, * as fromParams from "reducers/params";
import filters from "reducers/filters";
import data from "reducers/data";
import localization from "reducers/localization";

export default combineReducers({
  app,
  auth,
  request,
  things,
  params,
  filters,
  data,
  localization,
});

export const isLoading = state => fromRequest.isLoading(state.request);
export const hasError = state => fromRequest.hasError(state.request);
export const shouldShowError = state => hasError(state) && state.app.showError;
export const getParam = (state, param) => fromParams.getParam(state.params, param);
export const isResetDisabled = state => state.params.isResetDisabled && state.filters.items.length === 0;
