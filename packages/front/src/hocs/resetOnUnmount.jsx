import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { reset } from "actions/common";

export const withResetOnUnmount = WrappedComponent => {
  class ResetOnUnmount extends React.Component {
    componentWillUnmount() {
      this.props.reset();
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  ResetOnUnmount.propTypes = {
    reset: PropTypes.func.isRequired,
  };
  return connect(
    null,
    { reset },
  )(ResetOnUnmount);
};
