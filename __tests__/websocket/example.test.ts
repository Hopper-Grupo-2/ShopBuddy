import { createServer } from "http";
import { Server, Socket as SocketServer } from "socket.io";
//import { Socket, io } from "socket.io-client";
import Client, { Socket as SocketClient, io } from "socket.io-client";

import Websocket from "../../server/src/websocket";

describe("my awesome project", () => {
  let myIo: Server, serverSocket: SocketServer, clientSocket: SocketClient;

  beforeAll((done) => {
    const httpServer = createServer();
    //io = new Server(httpServer);
    myIo = new Server(httpServer);
    httpServer.listen(() => {
      const address = httpServer.address();
      if (address && typeof address === "object" && "port" in address) {
        const port = address.port;
        clientSocket = Client(`http://localhost:${port}`) as SocketClient;
        myIo.on("connection", (socket: SocketServer) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      } else {
        done.fail("Unable to determine server port");
      }
    });
  });

  afterAll(() => {
    myIo.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    clientSocket.on("hello", (arg: string) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb: (arg: string) => void) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg: string) => {
      expect(arg).toBe("hola");
      done();
    });
  });
});

/*

// createWebSocketServer.test.js

// https://thomason-isaiah.medium.com/writing-integration-tests-for-websocket-servers-using-jest-and-ws-8e5c61726b2a

describe("WebSocket Server", () => {
  beforeAll(() => {
    // Start server
  });
  afterAll(() => {
    // Close server
  });
  test("Server echoes the message it receives from client", () => {
    // 1. Create test client
    // 2. Send client message
    // 3. Close the client after it receives the response
    // 4. Perform assertions on the response
  });
});
*/
