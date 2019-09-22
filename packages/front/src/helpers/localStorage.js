const languageKey = "language";
const tokenKey = "token";

export const setLanguage = language => window.localStorage.setItem(languageKey, language);
export const getLanguage = () => window.localStorage.getItem(languageKey);
export const getToken = () => window.localStorage.getItem(tokenKey);
