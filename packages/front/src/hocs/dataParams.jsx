import React from "react";
import PropTypes from "prop-types";
import { withResetOnUnmount } from "hocs/resetOnUnmount";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import QueryString from "query-string";
import { updateParams } from "actions/params";
import { addThingFilter } from "actions/thingFilter";
import { addTimePeriodFilter, addCustomTimePeriodFilter } from "actions/dateFilter";
import * as fromState from "reducers";
import { defaultTimePeriodFilter, defaultGroupBy } from "config/params";

export const handleDataParams = (path, paramNames, getData, reset) => WrappedComponent => {
  class DataParams extends React.Component {
    componentDidMount() {
      const {
        history,
        match: { params: urlParams },
        location: { search },
      } = this.props;
      const [firstParamName, secondParamName, thirdParamName] = paramNames;
      const firstParam = urlParams[firstParamName];
      const secondParam = urlParams[secondParamName];
      const thirdParam = urlParams[thirdParamName] || defaultGroupBy;
      if (!firstParam || !secondParam || !thirdParam) {
        return;
      }
      const params = {
        [firstParamName]: firstParam,
        [secondParamName]: secondParam,
        [thirdParamName]: thirdParam,
      };
      this.props.updateParams(params);
      const { thing, timePeriod = defaultTimePeriodFilter, startDate, endDate } = QueryString.parse(search) || {};
      let newQueryParams = {};
      if (thing) {
        this.props.addThingFilter(thing);
        newQueryParams = { ...newQueryParams, thing };
      }
      if (startDate || endDate) {
        this.props.addCustomTimePeriodFilter(startDate, endDate);
        newQueryParams = { ...newQueryParams, startDate, endDate };
      } else {
        this.props.addTimePeriodFilter(timePeriod);
        newQueryParams = { ...newQueryParams, timePeriod };
      }
      const newSearch = QueryString.stringify(newQueryParams);
      const basePath = `/${path}/${firstParam}/${secondParam}/${thirdParam}?${newSearch}`;
      history.push(basePath);
      getData();
    }
    componentDidUpdate() {
      const {
        match: { params },
        hasError,
      } = this.props;
      const [firstParamName, secondParamName, thirdParamName] = paramNames;
      const firstParam = params[firstParamName];
      const secondParam = params[secondParamName];
      const thirdParam = params[thirdParamName];
      if (firstParam && secondParam && thirdParam && hasError) {
        this._pushRootPath();
      }
    }
    _onParamsSelected = (...params) => {
      const [firstParam, secondParam, thirdParam] = params;
      if (!firstParam || !secondParam || !thirdParam) {
        return;
      }
      const {
        history,
        location: { search },
      } = this.props;
      const basePath = `/${path}/${firstParam}/${secondParam}/${thirdParam}?${search}`;
      history.push(basePath);
      getData();
    };
    _onFiltersSelected = (thing, timePeriod, startDate, endDate) => {
      const {
        history,
        location: { pathname },
      } = this.props;
      const params = {};
      if (thing) {
        params.thing = thing;
      }
      if (timePeriod) {
        params.timePeriod = timePeriod;
      }
      if (startDate) {
        params.startDate = startDate.toISOString();
      }
      if (endDate) {
        params.endDate = endDate.toISOString();
      }
      if (thing || timePeriod || startDate || endDate) {
        const search = QueryString.stringify(params);
        history.push(`${pathname}?${search}`);
      } else {
        history.push(pathname);
      }
      getData();
    };
    _onReset = () => {
      reset();
      this._pushRootPath();
    };
    _pushRootPath = () => {
      const { history } = this.props;
      history.push(`/${path}`);
    };
    render() {
      return (
        <WrappedComponent
          {...this.props}
          onParamsSelected={this._onParamsSelected}
          onFiltersSelected={this._onFiltersSelected}
          onReset={this._onReset}
        />
      );
    }
  }
  DataParams.propTypes = {
    hasError: PropTypes.bool.isRequired,
    updateParams: PropTypes.func.isRequired,
    addThingFilter: PropTypes.func.isRequired,
    addTimePeriodFilter: PropTypes.func.isRequired,
    addCustomTimePeriodFilter: PropTypes.func.isRequired,
    match: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };
  const withConnect = connect(
    state => ({
      hasError: fromState.hasError(state),
    }),
    { updateParams, addThingFilter, addTimePeriodFilter, addCustomTimePeriodFilter },
  );
  return compose(
    withConnect,
    withResetOnUnmount,
    withRouter,
  )(DataParams);
};
