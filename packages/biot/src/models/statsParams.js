export class StatsParams {
  constructor(chatId) {
    this.chatId = chatId;
  }
  setThing(thing) {
    this.thing = thing;
  }
  setTimePeriod(timePeriod) {
    this.timePeriod = timePeriod;
  }
  toJSON() {
    return {
      thing: this.thing,
      timePeriod: this.timePeriod,
    };
  }
}
