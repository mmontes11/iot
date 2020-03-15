import React from "react";
import PropTypes from "prop-types";
import { withResetOnUnmount } from "hocs/resetOnUnmount";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import QueryString from "query-string";
import * as paramActions from "actions/params";
import * as thingFilterActions from "actions/thingFilter";
import * as dateFilterActions from "actions/dateFilter";
import * as fromState from "reducers";

export const handleDataParams = ({ path, pathParams, queryParams, getData, reset }) => WrappedComponent => {
  const getPathParamsObject = urlParams =>
    pathParams.reduce((acc, { id, defaultValue }) => {
      const value = urlParams[id] || defaultValue;
      if (value) {
        return { ...acc, [id]: value };
      }
      return acc;
    }, {});

  const getQueryParamsObject = search => {
    const queryParamsFromUrl = QueryString.parse(search) || {};
    return queryParams.reduce((acc, { id, defaultValue }) => {
      const value = queryParamsFromUrl[id] || defaultValue;
      if (value) {
        return { ...acc, [id]: value };
      }
      return acc;
    }, {});
  };

  const getPath = (pathParamsObject, queryParamsObject) => {
    const paramsPath = Object.keys(pathParamsObject).reduce((acc, id) => {
      const partialPath = pathParamsObject[id];
      if (acc === "") {
        return partialPath;
      }
      return `${acc}/${partialPath}`;
    }, "");
    let basePath = `/${path}`;
    if (paramsPath.length > 0) {
      basePath += `/${paramsPath}`;
    }
    if (Object.keys(queryParamsObject).length > 0) {
      const search = QueryString.stringify(queryParamsObject);
      basePath += `?${search}`;
    }
    return basePath;
  };

  class DataParams extends React.Component {
    componentDidMount() {
      const {
        history,
        match: { params: urlParams },
        location: { search },
        updateParams,
        addThingFilter,
        addCustomTimePeriodFilter,
        addTimePeriodFilter,
      } = this.props;
      const paramsWithValues = getPathParamsObject(urlParams);
      if (Object.keys(paramsWithValues).length > 0) {
        updateParams(paramsWithValues);
      }
      const queryParamsWithValues = getQueryParamsObject(search);
      const { thing, startDate, endDate, timePeriod } = queryParamsWithValues;
      if (thing) {
        addThingFilter(thing);
      }
      if (startDate || endDate) {
        addCustomTimePeriodFilter(startDate, endDate);
      } else {
        addTimePeriodFilter(timePeriod);
      }
      const newPath = getPath(paramsWithValues, queryParamsWithValues);
      history.push(newPath);
      if (Object.keys(paramsWithValues).length === pathParams.length) {
        getData();
      }
    }

    componentDidUpdate() {
      const {
        match: { params: urlParams },
        hasError,
      } = this.props;
      const paramsWithValues = getPathParamsObject(urlParams);
      if (Object.keys(paramsWithValues).length === pathParams.length && hasError) {
        this._pushRootPath();
      }
    }

    _onParamsSelected(...params) {
      if (pathParams.length !== params.length) {
        return;
      }
      const {
        history,
        location: { search },
      } = this.props;
      const paramsPath = params.reduce((acc, value) => (acc !== "" ? `${acc}/${value}` : value), "");
      let basePath = `/${path}/${paramsPath}`;
      if (search) {
        basePath += `${search}`;
      }
      history.push(basePath);
      getData();
    }

    _onFiltersSelected(thing, timePeriod, startDate, endDate) {
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
    }

    _onReset() {
      reset();
      this._pushRootPath();
    }

    _pushRootPath() {
      const { history } = this.props;
      history.push(`/${path}`);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          onParamsSelected={(...params) => this._onParamsSelected(...params)}
          onFiltersSelected={(...filters) => this._onFiltersSelected(...filters)}
          onReset={() => this._onReset()}
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
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  const withConnect = connect(
    state => ({
      hasError: fromState.hasError(state),
    }),
    {
      updateParams: paramActions.updateParams,
      addThingFilter: thingFilterActions.addThingFilter,
      addTimePeriodFilter: dateFilterActions.addTimePeriodFilter,
      addCustomTimePeriodFilter: dateFilterActions.addCustomTimePeriodFilter,
    },
  );

  return compose(withConnect, withResetOnUnmount, withRouter)(DataParams);
};
