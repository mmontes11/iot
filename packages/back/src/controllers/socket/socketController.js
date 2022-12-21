import SocketIOClient from "socket.io-client";
import { logInfo, logError } from "../../utils/log";

export class SocketController {
  constructor(io) {
    this.io = io;
  }
  static _getQueryParams(socket) {
    const { token, type } = socket;
    let query = { token };
    if (type) {
      query = {
        ...query,
        type,
      };
    }
    return query;
  }
  static _handleThingDisconnect = (socket, err) => {
    logError(`Thing connection error: ${err}`);
    socket.emit("thing_disconnect", err);
    socket.disconnect();
  };
  static _getThingSocketUrl = thing => {
    const { THING_SOCKET_URL, THING_SOCKET_PORT } = process.env;
    if (THING_SOCKET_URL) {
      return THING_SOCKET_URL;
    }
    return `http://${thing.name}:${THING_SOCKET_PORT}`;
  };
  listen() {
    this.io.on("connection", socket => {
      logInfo("Socket connection");
      const { thing } = socket;
      const query = SocketController._getQueryParams(socket);
      const url = SocketController._getThingSocketUrl(thing);
      logInfo(`Opening socket connection to ${thing.name} @ ${url} ...`);
      const thingSocket = new SocketIOClient(url, {
        query,
      });
      thingSocket.on("data", data => {
        logInfo(`Receiving data from ${thing.name}:`);
        logInfo(JSON.stringify(data));
        socket.emit("data", data);
      });
      thingSocket.on("disconnect", () =>
        SocketController._handleThingDisconnect(socket, new Error("Thing disconnected")),
      );
      thingSocket.on("connect_error", err => SocketController._handleThingDisconnect(socket, err));
      thingSocket.on("thing_disconnect", err => SocketController._handleThingDisconnect(socket, err));
      thingSocket.on("error", err => {
        logError(`Thing error: ${err}`);
        socket.emit("thing_error", err);
        socket.disconnect();
      });
      socket.on("disconnect", () => {
        logInfo("Socket disconnection");
        thingSocket.disconnect();
      });
      socket.on("error", err => {
        logError(`Socket error: ${err}`);
        socket.emit("socket_server_error", err);
        socket.disconnect();
      });
    });
  }
  close() {
    logInfo("Socket server stopped");
    Object.keys(this.io.sockets.sockets).forEach(s => {
      this.io.sockets.sockets[s].disconnect();
    });
  }
}
