import React from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { compose } from "recompose";
import * as actionsAuth from "actions/auth";
import * as appActions from "actions/app";
import { FormattedMessage } from "react-intl";
import LanguageSelector from "containers/LanguageSelector";

const Navbar = ({ isHamburgerMenuExpanded, logout, toggleHamburgerMenu }) => {
  const navbarBurgerClass = classNames("navbar-burger", "burger", {
    "is-active": isHamburgerMenuExpanded,
  });
  const navbarMenuClass = classNames("navbar-menu", {
    "is-active": isHamburgerMenuExpanded,
  });
  return (
    <nav className="navbar has-shadow is-spaced">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-item">
          <FormattedMessage id="IoT">{txt => <h1 className="title">{txt}</h1>}</FormattedMessage>
        </NavLink>
        <div
          className={navbarBurgerClass}
          data-target="navbar-menu"
          onClick={() => toggleHamburgerMenu()}
          onKeyPress={() => toggleHamburgerMenu()}
          role="button"
          tabIndex={0}
        >
          <span />
          <span />
          <span />
        </div>
      </div>
      <div id="navbar-menu" className={navbarMenuClass}>
        <div className="navbar-start">
          <NavLink to="/things" className="navbar-item" activeClassName="navbar-item-active">
            <span className="icon">
              <i className="fas fa-microchip" />
            </span>
            <FormattedMessage id="Things" />
          </NavLink>
          <NavLink to="/stats" className="navbar-item" activeClassName="navbar-item-active">
            <span className="icon">
              <i className="fas fa-chart-bar" />
            </span>
            <FormattedMessage id="Stats" />
          </NavLink>
          <NavLink to="/data" className="navbar-item" activeClassName="navbar-item-active">
            <span className="icon">
              <i className="fas fa-database" />
            </span>
            <FormattedMessage id="Data" />
          </NavLink>
          <NavLink to="/real-time" className="navbar-item" activeClassName="navbar-item-active">
            <span className="icon">
              <i className="fas fa-clock" />
            </span>
            <FormattedMessage id="Real time" />
          </NavLink>
        </div>
        <div className="navbar-end">
          <LanguageSelector />
          <div className="navbar-item">
            <div className="field">
              <p className="control">
                <button type="button" id="logout-button" className="button is-primary" onClick={() => logout()}>
                  <span className="icon">
                    <i className="fa fa-user" />
                  </span>
                  <FormattedMessage id="Logout" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isHamburgerMenuExpanded: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  toggleHamburgerMenu: PropTypes.func.isRequired,
};

const withConnect = connect(
  state => ({
    isHamburgerMenuExpanded: state.app.isHamburgerMenuExpanded,
  }),
  { logout: actionsAuth.logout, toggleHamburgerMenu: appActions.toggleHamburgerMenu },
);

export default compose(withRouter, withConnect)(Navbar);
