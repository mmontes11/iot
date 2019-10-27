export const getBasicAuthHeader = (username, password) => btoa(`${username}:${password}`);
