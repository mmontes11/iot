const Transport = require("winston-transport");

export class BrowserConsole extends Transport {
  constructor(opts) {
    super(opts);
    this.name = "BrowserConsole";
  }
  log(method, message) {
    setImmediate(() => {
      this.emit("logged", method);
    });
    switch (method) {
      case "error":
        console.error(message);
        break;
      case "warn":
        console.warn(message);
        break;
      case "info":
        console.info(message);
        break;
      default:
        break;
    }
  }
}
