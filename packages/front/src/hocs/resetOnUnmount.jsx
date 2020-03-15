import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as commonActions from "actions/common";

export const withResetOnUnmount = WrappedComponent => {
  const ResetOnUnmount = props => {
    const { reset } = props;
    useEffect(() => () => reset(), []);
    return <WrappedComponent {...props} />;
  };
  ResetOnUnmount.propTypes = {
    reset: PropTypes.func.isRequired,
  };
  return connect(null, commonActions)(ResetOnUnmount);
};
