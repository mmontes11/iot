import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as localizationActions from "actions/localization";
import LanguageItem from "components/LanguageItem";

const LanguageSelector = ({ selectedLanguage, languages, updateLanguage }) => (
  <div className="navbar-item has-dropdown is-hoverable">
    <button type="button" className="navbar-link button is-white">
      <LanguageItem language={selectedLanguage} />
    </button>
    <div className="navbar-dropdown">
      {languages
        .filter(lang => lang !== selectedLanguage)
        .map(lang => (
          <button type="button" key={lang} className="navbar-item button is-white" onClick={() => updateLanguage(lang)}>
            <LanguageItem language={lang} />
          </button>
        ))}
    </div>
  </div>
);

LanguageSelector.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateLanguage: PropTypes.func.isRequired,
};

const withConnect = connect(
  state => ({
    selectedLanguage: state.localization.selectedLanguage,
    languages: state.localization.languages,
  }),
  { ...localizationActions },
);

export default withConnect(LanguageSelector);
