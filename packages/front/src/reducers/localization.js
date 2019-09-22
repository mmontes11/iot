import { getSelectedLanguage, getLanguages, getTranslations } from "config/localization";
import { UPDATE_LANGUAGE } from "constants/actionTypes/localization";

const selectedLanguage = getSelectedLanguage();
export const initialState = {
  selectedLanguage,
  languages: getLanguages(selectedLanguage),
  translations: getTranslations(selectedLanguage),
};

export default (state = initialState, { type, language }) => {
  switch (type) {
    case UPDATE_LANGUAGE:
      return {
        selectedLanguage: language,
        languages: getLanguages(language),
        translations: getTranslations(language),
      };
    default:
      return state;
  }
};
