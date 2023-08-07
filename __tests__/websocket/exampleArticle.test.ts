import http from "http";
import {
  startServer,
  waitForSocketState,
  createSocketClient,
} from "../helpers/webSocketTestUtils";
import Client, { Socket as SocketClient, io } from "socket.io-client";

const port = 3001;

describe("WebSocket Server", () => {
  let server: http.Server;

  beforeAll(async () => {
    // Start server
    server = (await startServer(port)) as http.Server;
  });

  afterAll(() => {
    // Close server
    server.close();
  });

  test("Server echoes the message it receives from client", async () => {
    // 1. Create test client
    //const clientSocket: SocketClient = Client(`http://localhost:${port}`);
    //await waitForSocketState(clientSocket, true);

    const [clientSocket, messages] = await createSocketClient(port, 1);

    const testMessage = "This is a test message";

    // 2. Send client message
    clientSocket.send(testMessage);

    // 4. Perform assertions on the response
    await waitForSocketState(clientSocket, false);
    //como passei (port,1), então só uma mensagem foi enviada e só quero receber
    // uma string
    const [responseMessage] = messages;
    expect(responseMessage).toBe(testMessage);
  });
});
