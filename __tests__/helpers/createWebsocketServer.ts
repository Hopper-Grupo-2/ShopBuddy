// createWebSocketServer.js
import http, { createServer } from "http";

import { Server, Socket as SocketServer } from "socket.io";

function createWebSocketServer(server: http.Server) {
  let myIo: Server;

  myIo = new Server(server);

  myIo.on("connection", function (webSocket: SocketServer) {
    webSocket.on("message", function (message) {
      const data = JSON.parse(message);
      switch (data.type) {
        case "ECHO": {
          webSocket.send(data.value);
          break;
        }
        // causes the server to send multiple responses to the same client
        case "ECHO_TIMES_3": {
          for (let i = 1; i <= 3; i++) {
            webSocket.send(data.value);
          }
        }
      }
    });
  });
}
export default createWebSocketServer;
