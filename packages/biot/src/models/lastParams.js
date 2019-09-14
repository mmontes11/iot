export class LastParams {
  constructor(chatId) {
    this.chatId = chatId;
  }
  setThing(thing) {
    this.thing = thing;
  }
  setType(type) {
    this.type = type;
  }
  toJSON() {
    return {
      thing: this.thing,
      type: this.type,
    };
  }
}
