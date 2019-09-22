import { UPDATE_LANGUAGE } from "constants/actionTypes/localization";
import { setLanguage } from "helpers/localStorage";

export const updateLanguage = language => dispatch => {
  dispatch({ type: UPDATE_LANGUAGE, language });
  setLanguage(language);
};
