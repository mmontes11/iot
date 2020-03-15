import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import IntlProvider from "containers/intlProvider";
import { BrowserRouter as Router } from "react-router-dom";
import App from "containers/app";
import store from "config/store";
import { isAuth } from "actions/auth";
import { setupLocalization } from "config/localization";

setupLocalization();

render(
  <Provider store={store}>
    <IntlProvider>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </Provider>,
  document.getElementById("app"),
);

store.dispatch(isAuth());
