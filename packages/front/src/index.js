import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import IntlProvider from "containers/IntlProvider";
import { BrowserRouter as Router } from "react-router-dom";
import App from "containers/App";
import store from "config/store";
import { checkAuth } from "actions/auth";
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

store.dispatch(checkAuth());
