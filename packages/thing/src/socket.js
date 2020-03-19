const { logInfo, logError } = require("./log");
const getData = require("./mock");

const clearSocketInterval = ({ intervalId }) => intervalId && clearInterval(intervalId);

class Socket {
  constructor(io) {
    this.io = io;
    this.numConnections = 0;
    this.interval = 2000;
  }
  listen() {
    this.io.on("connection", socket => {
      logInfo("Socket connection");
      this.numConnections += 1;
      logInfo(`Number of connections: ${this.numConnections}`);

      const {
        handshake: { query },
      } = socket;
      let prevValue = null;
      const emitData = () => {
        try {
          const data = getData(query, prevValue);
          prevValue = data;
          socket.emit("data", data);
          logInfo(`Emiting data: ${JSON.stringify(data)}`);
        } catch (err) {
          logError(err);
        }
      };
      emitData();
      socket.intervalId = setInterval(emitData, this.interval);

      socket.on("disconnect", () => {
        logInfo("Socket disconnection");
        this.numConnections -= 1;
        logInfo(`Number of connections: ${this.numConnections}`);
        clearSocketInterval(socket);
        if (this.numConnections === 0) {
          this.close();
        }
      });

      socket.on("error", error => {
        logError(error);
        socket.emit("thing_error", error);
        clearSocketInterval(socket);
      });
    });
  }
  close() {
    logInfo("Closing all socket connections...");
    Object.keys(this.io.sockets.sockets).forEach(s => {
      const socket = this.io.sockets.sockets[s];
      clearSocketInterval(socket);
      socket.disconnect(true);
    });
  }
}

module.exports = Socket;
