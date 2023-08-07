// webSocketTestUtils.js
import http from "http";
import createWebSocketServer from "./createWebsocketServer";
import Client, { Socket as SocketClient, io } from "socket.io-client";

function startServer(port: number) {
  const server = http.createServer();
  createWebSocketServer(server);
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

// Se o usuário está esperando a conexão está aberta, waitIsConnected vai ser true
// e a comparação continua até que socket.connected seja true também
// sea função foi passada esperando que a conexão seja fechada, é passado waitIsConnected=false
// e a comparação continua até que socket.connected seja falso também
//
function waitForSocketState(socket: SocketClient, waitIsConnected: boolean) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.connected === waitIsConnected) {
        resolve("Socket state is now as expected."); // i added a message because TS
      } else {
        waitForSocketState(socket, waitIsConnected).then(resolve);
      }
    }, 5);
  });
}

// essa função permite retornar o client e todas as mensagens recebidas
async function createSocketClient(
  port: number,
  closeAfter?: number
): Promise<[SocketClient, string[]]> {
  const clientSocket: SocketClient = Client(`http://localhost:${port}`);

  await waitForSocketState(clientSocket, true);

  const messages: string[] = [];

  clientSocket.on("message", (data: string) => {
    messages.push(data);
    console.log("OLHA MESSAGES->", messages, data);
    // troquei de === por >= com medo de algum loop infinito
    if (messages.length === closeAfter) {
      console.log("Fechou alguem!", data);
      clientSocket.close();
    }
  });
  return [clientSocket, messages];
}

export { startServer, waitForSocketState, createSocketClient };
