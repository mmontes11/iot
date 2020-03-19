import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import PropTypes from "prop-types";
import classNames from "classnames";
import * as fromState from "reducers";
import * as authActions from "actions/auth";
import { withResetOnUnmount } from "hocs/resetOnUnmount";
import { injectIntl, intlShape } from "react-intl";

const Login = ({ intl: { formatMessage }, username, password, isLoading, setUsername, setPassword, login }) => {
  const btnClass = classNames("button", "is-block", "is-primary", "is-large", "is-fullwidth", {
    "is-loading": isLoading,
  });
  return (
    <section className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="column is-4 is-offset-4">
            <div className="box">
              <p className="title is-1">{formatMessage({ id: "IoT" })}</p>
              <form
                onSubmit={event => {
                  event.preventDefault();
                  login();
                }}
              >
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      id="username-input"
                      className="input is-large"
                      placeholder={formatMessage({ id: "Username" })}
                      onChange={({ target: { value } }) => setUsername(value)}
                      value={username || ""}
                    />
                    <span className="icon is-large is-left">
                      <i className="fas fa-user" />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <div className="control has-icons-left">
                    <input
                      id="password-input"
                      className="input is-large"
                      type="password"
                      placeholder={formatMessage({ id: "Password" })}
                      onChange={({ target: { value } }) => setPassword(value)}
                      value={password || ""}
                    />
                    <span className="icon is-large is-left">
                      <i className="fas fa-lock" />
                    </span>
                  </div>
                </div>
                <button type="submit" id="login-button" className={btnClass} disabled={isLoading}>
                  {formatMessage({ id: "Login" })}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string,
  password: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  setUsername: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};

Login.defaultProps = {
  username: "",
  password: "",
};

const withConnect = connect(
  state => ({
    username: state.auth.username,
    password: state.auth.password,
    isLoading: fromState.isLoading(state),
  }),
  authActions,
);

export default compose(withConnect, withResetOnUnmount, injectIntl)(Login);
