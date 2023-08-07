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

  // ...
  test("When given an ECHO_TO_ALL message, the server sends the message it receives to all clients", async () => {
    // Create test clients
    const [client1, messages1] = await createSocketClient(port, 1);
    const [client2, messages2] = await createSocketClient(port, 1);
    const [client3, messages3] = await createSocketClient(port, 1);
    const testMessage = {
      type: "ECHO_TO_ALL",
      value: "This is a test message sent to all clients",
    };
    // Send client message - basta um client mandar uma mensagem, esse teste
    // verifica se o server emite a mensagem para todos os clients
    client1.send(JSON.stringify(testMessage));
    // Perform assertions on the responses
    await waitForSocketState(client1, false);
    await waitForSocketState(client2, false);
    await waitForSocketState(client3, false);
    expect(messages1[0]).toBe(testMessage.value);
    expect(messages2[0]).toBe(testMessage.value);
    expect(messages3[0]).toBe(testMessage.value);
  });
  /*
  test("When given a MESSAGE_GROUP message, the server echoes the message it receives to everyone in the specified group", async () => {
    // Create test clients
    const [client1, messages1] = await createSocketClient(port); //no artigo ele nao botou o segundo parametro, coloquei 4 por enquanto
    const [client2, messages2] = await createSocketClient(port, 2);
    const [client3, messages3] = await createSocketClient(port); //no artigo ele nao botou o segundo parametro, coloquei 4 por enquanto
    const creationMessage = { type: "CREATE_GROUP", value: "TEST_GROUP" };
    const testMessage = "This is a test message sent to a group";

    client2.on("close", () => {
      console.log("ENTROU AQUI!");
      client1.close();
      client3.close();
    });

    // Setup test clients to send messages and close in the right order
    client1.on("message", (data) => {
      if (data === creationMessage.value) {
        const joinMessage = { type: "JOIN_GROUP", value: data };
        const groupMessage = {
          type: "MESSAGE_GROUP",
          value: { groupName: data, groupMessage: testMessage },
        };
        client2.send(JSON.stringify(joinMessage));
        client2.send(JSON.stringify(groupMessage));
      }
    });

    // Send client message
    client1.send(JSON.stringify(creationMessage));
    // Perform assertions on the responses
    await waitForSocketState(client1, false);
    await waitForSocketState(client2, false);
    await waitForSocketState(client3, false);

    const [group1, message1] = messages1;
    const [group2, message2] = messages2;

    // Both client1 and client2 should have joined the same group.
    expect(group1).toBe(creationMessage.value);
    expect(group2).toBe(creationMessage.value);
    // Both client1 and client2 should have received the group message.
    expect(message1).toBe(testMessage);
    expect(message2).toBe(testMessage);
    // client3 should have received no messages
    expect(messages3.length).toBe(0);
  });
  */
});
