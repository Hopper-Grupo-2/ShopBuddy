// createWebSocketServer.js
import http, { createServer } from "http";
import { Server, Socket as SocketServer } from "socket.io";

const groupNames: string[] = [];

function createWebSocketServer(server: http.Server) {
  let myIo: Server;

  myIo = new Server(server);

  myIo.on("connection", function (webSocket: SocketServer) {
    webSocket.on("message", function (message) {
      const data = JSON.parse(message);
      switch (data.type) {
        case "ECHO":
          webSocket.send(data.value);
          break;
        case "ECHO_TIMES_3":
          for (let i = 1; i <= 3; i++) {
            webSocket.send(data.value);
          }
          break;
        case "ECHO_TO_ALL":
          myIo.emit("message", data.value);
          break;
        case "CREATE_GROUP": {
          const groupName = data.value;
          if (!groupNames.includes(groupName)) {
            groupNames.push(groupName);
            webSocket.join(groupName);
            webSocket.send(groupName);
          } else {
            webSocket.send("GROUP_UNAVAILABLE");
          }
          break;
        }
        case "JOIN_GROUP": {
          const joinGroupName = data.value;
          const currentGroup = groupNames.find((group) =>
            webSocket.rooms.has(group)
          );
          if (!currentGroup) {
            webSocket.send("GROUP_UNAVAILABLE");
          } else {
            webSocket.leave(currentGroup);
            webSocket.join(joinGroupName);
            webSocket.send(joinGroupName);
          }
          break;
        }
        case "MESSAGE_GROUP": {
          const { groupMessage } = data.value;
          const currentGroup = groupNames.find((group) =>
            webSocket.rooms.has(group)
          );
          if (currentGroup) {
            myIo.to(currentGroup).emit("message", groupMessage);
          }
          break;
        }
      }
    });
  });
}
export default createWebSocketServer;
