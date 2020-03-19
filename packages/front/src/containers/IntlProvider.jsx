import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { IntlProvider as ReactIntlProvider } from "react-intl";

const IntlProvider = ({ locale, messages, children }) => (
  <ReactIntlProvider key={locale} locale={locale} messages={messages}>
    {children}
  </ReactIntlProvider>
);

IntlProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  messages: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
};

const withConnect = connect(state => ({
  locale: state.localization.selectedLanguage,
  messages: state.localization.translations,
}));

export default withConnect(IntlProvider);
