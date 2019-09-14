import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";
import { registerLocale } from "react-datepicker";
import localeES from "date-fns/locale/es";
import localeEN from "date-fns/locale/en-GB";
import { getLanguage } from "helpers/localStorage";

export const setupLocalization = () => {
  addLocaleData([...en, ...es]);
  registerLocale("es", localeES);
  registerLocale("en", localeEN);
};

export const supportedLanguages = ["en", "es"];

export const getSelectedLanguage = () => {
  const userLanguage =
    getLanguage() || (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
  const userLanguageWithoutRegionCode = userLanguage.toLowerCase().split(/[_-]+/)[0];
  const preferredLanguage = supportedLanguages.find(language => language === userLanguageWithoutRegionCode);
  return preferredLanguage || supportedLanguages[0];
};

export const getLanguages = selectedLanguage => {
  const otherLanguages = supportedLanguages.filter(language => language !== selectedLanguage);
  return [selectedLanguage, ...otherLanguages];
};

export const getTranslations = language => {
  const translations = require(`./translations/${language}-translations.json`);
  return translations;
};
