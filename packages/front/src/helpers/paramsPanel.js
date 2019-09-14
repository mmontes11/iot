export const isParamDisabled = param => {
  if (param && param.isDisabled !== undefined) {
    return param.isDisabled;
  }
  return true;
};
