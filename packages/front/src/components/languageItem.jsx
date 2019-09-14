import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

const countryCodeForLanguage = language => (language === "en" ? "gb" : language);
const translationForLanguage = language => <FormattedMessage id={language} />;

const LanguageItem = ({ language }) => (
  <Fragment>
    <span className="icon is-medium">
      <i className={`flag-icon flag-icon-${countryCodeForLanguage(language)}`} />
    </span>
    {translationForLanguage(language)}
  </Fragment>
);

LanguageItem.propTypes = {
  language: PropTypes.string.isRequired,
};

export default LanguageItem;
