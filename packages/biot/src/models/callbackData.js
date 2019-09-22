const CallbackDataType = Object.freeze({
  thingLastMeasurement: "THLM",
  typeLastMeasurement: "TYLM",
  thingLastEvent: "THLE",
  typeLastEvent: "TYLE",
  thingMeasurement: "THM",
  timePeriodMeasurement: "TPME",
  thingEvent: "THE",
  timePeriodEvent: "TPE",
  topicType: "TOTY",
  existingTopic: "ETO",
  subscription: "S",
});

class CallbackData {
  constructor(callbackDataType, data) {
    this.type = callbackDataType;
    this.data = data;
  }
  serialize() {
    const json = {
      type: this.type,
      data: this.data,
    };
    return JSON.stringify(json);
  }
  static deserialize(stringJSON) {
    const json = JSON.parse(stringJSON);
    return new CallbackData(json.type, json.data);
  }
}

export { CallbackDataType, CallbackData };
