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
    const [clientSocket, messages] = await createSocketClient(port, 1);

    const testMessage = { type: "ECHO", value: "This is a test message" };

    // 2. Send client message
    clientSocket.send(JSON.stringify(testMessage));

    // 4. Perform assertions on the response
    //como quero esperar o socket está fechado, para iniciar os testes, passo FALSE
    // pois assim ele vai esperar até que disconnect(connect===false)
    await waitForSocketState(clientSocket, false);
    //como passei (port,1), então só uma mensagem foi enviada e só quero receber
    // uma string
    const [responseMessage] = messages;
    expect(responseMessage).toBe(testMessage.value);
  });

  //
  test("When given an ECHO_TIMES_3 message, the server echoes the message it receives from client 3 times", async () => {
    // Create test client
    const [client, messages] = await createSocketClient(port, 3);
    const testMessage = {
      type: "ECHO_TIMES_3",
      value: "This is a test message send 3 times",
    };
    const expectedMessages: string[] = [...Array(3)].map(
      () => testMessage.value
    );

    // Send client message
    client.send(JSON.stringify(testMessage));
    // Perform assertions on the response
    await waitForSocketState(client, false);

    expect(messages).toStrictEqual(expectedMessages);
    expect(messages.length).toBe(3);
  });
});
