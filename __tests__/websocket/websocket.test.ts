import http from "http";
import { Socket, io as clientIO } from "socket.io-client";
import Websocket from "../../server/src/websocket";
import { Server } from "socket.io";

const port = 3001;

describe("WebSocket Server", () => {
  let websocket: Websocket;
  let client: Socket;
  let io: Server;

  beforeAll(() => {
    const httpServer = http.createServer();
    io = new Server(httpServer);
    httpServer.listen(port, () => {});
    websocket = Websocket.getIstance();
    websocket.setIO(io);
    websocket.initialize();
  });

  beforeEach(() => {
    client = clientIO(`http://localhost:${port}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
    client.removeAllListeners();
    client.disconnect();
  });

  afterAll(() => {
    io.close();
  });

  it("should get an instance of Websocket", () => {
    expect(websocket).toBeInstanceOf(Websocket);
  });

  it("should log a client when they reach the server", (done) => {
    client.on("connect", () => {
      expect(client.connected).toBe(true);
      done();
    });
  });

  it("should handle client login", (done) => {
    const userId = "123";

    client.emit("login", userId);

    client.on("loginSuccess", (id) => {
      expect(id).toEqual(userId);
      done();
    });
  });

  it("should broadcast the message to the logged-in user", (done) => {
    const userId = "123";

    client.on("loginSuccess", (id) => {
      websocket.broadcastToUser(id, "testEvent1", { success: true });
    });

    client.on("testEvent1", (data) => {
      expect(data.success).toBe(true);
      done();
    });

    client.emit("login", userId);
  });

  it("should handle client entering a list", (done) => {
    const userId = "1234";
    const listId = "4321";

    client.on("loginSuccess", () => {
      client.emit("enterList", listId, userId);
    });

    client.on("enterSuccess", (data) => {
      expect(data.userId).toEqual(userId);
      expect(data.listId).toEqual(listId);
      done();
    });

    client.emit("login", userId);
  });

  it("should broadcast the sender's message to users connected to the list", (done) => {
    const senderId = "123";
    const receiverId = "124";
    const listId = "321";

    client.on("loginSuccess", (userId) => {
      client.emit("enterList", listId, userId);
    });

    client.on("enterSuccess", (data) => {
      websocket.broadcastToList(data.listId, senderId, "testEvent2", {
        senderId,
      });
    });

    client.on("testEvent2", (data) => {
      expect(data.senderId).toEqual(senderId);
      done();
    });

    client.emit("login", receiverId);
  });

  it("should handle client exiting a list", (done) => {
    const userId = "12345";
    const listId = "54321";

    client.on("loginSuccess", () => {
      client.emit("enterList", listId, userId);
    });

    client.on("enterSuccess", () => {
      client.emit("exitList", listId, userId);
    });

    client.on("exitSuccess", (data) => {
      expect(data.userId).toEqual(userId);
      expect(data.listId).toEqual(listId);
      done();
    });

    client.emit("login", userId);
  });
});
