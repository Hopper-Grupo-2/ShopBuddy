// createWebSocketServer.js
import { createServer } from "http";

import { Server, Socket as SocketServer } from "socket.io";

function createWebSocketServer(server: any) {
  let myIo: Server;

  myIo = new Server(server);

  myIo.on("connection", function (webSocket) {
    webSocket.on("message", function (message) {
      webSocket.send(message);
    });
  });
}
export default createWebSocketServer;
