import SocketIOClient from "socket.io-client";
import { getToken } from "helpers/localStorage";

export class SocketController {
  constructor(thing, type = null, onData, onError) {
    let query = {
      token: getToken(),
      thing,
    };
    if (type) {
      query = {
        ...query,
        type,
      };
    }
    const options = {
      query,
      transports: ["polling", "websocket"],
    };
    this.socket = SocketIOClient(process.env.FRONT_SOCKET_URL, options);
    this.onData = onData;
    this.onError = onError;
  }
  _handleError = err => {
    this.onError(err);
    this.close();
  };
  listen() {
    this.socket.on("data", data => this.onData(data));
    this.socket.on("error", err => this._handleError(err));
    this.socket.on("connect_error", err => this._handleError(err));
    this.socket.on("thing_disconnect", err => this._handleError(err));
    this.socket.on("thing_error", err => this._handleError(err));
    this.socket.on("socket_server_error", err => this._handleError(err));
  }
  close() {
    this.socket.close();
  }
}
