import { Server, Socket } from "socket.io";
import IConnection from "./interfaces/connection";
import Logger from "./log/logger";
export default class Websocket {
  private static instance: Websocket;
  private io: Server | null = null;
  private connections: Array<IConnection> = [];

  private constructor() {}

  public static getIstance(): Websocket {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket();
    }
    return Websocket.instance;
  }

  public setIO(io: Server) {
    this.io = io;
  }

  public initialize(): void {
    if (!this.io) return;
    this.io.on("connection", (socket: Socket) => {
      this.handleEvents(socket);
    });
  }

  private handleEvents(socket: Socket) {
    socket.on("login", (userId: string) => {
      try {
        this.setConnection(socket, userId);
        this.broadcastToUser(userId, "loginSuccess", userId);
        //socket.emit("loginSuccess", userId);
      } catch (error) {
        Logger.error("Error setting connection: " + error);
      }
    });

    socket.on("enterList", (listId: string, userId: string) => {
      try {
        this.joinListRoom(socket, listId, userId);
        this.broadcastToUser(userId, "enterSuccess", { userId, listId });
        //socket.emit("enterSuccess", { userId, listId });
        Logger.info("Client joined list " + listId);
      } catch (error) {
        Logger.error(`Error joining list room: ${error}`);
      }
    });

    socket.on("exitList", (listId: string, userId: string) => {
      try {
        this.leaveListRoom(userId);
        this.broadcastToUser(userId, "exitSuccess", { userId, listId });
        //socket.emit("exitSuccess", { userId, listId });
        Logger.info("Client left list " + listId);
      } catch (error) {
        Logger.error("Error leaving list room: " + error);
      }
    });

    socket.on("disconnect", () => {
      this.removeConnection(socket);
      Logger.info("Client disconnected");
    });
  }

  private joinListRoom(socket: Socket, listId: string, userId: string) {
    const connection = this.getConnection(userId);
    if (connection) {
      connection.listId = listId;
      connection.userId = userId;
    } else {
      this.connections.push({ connection: socket, listId, userId });
    }
  }

  private leaveListRoom(userId: string) {
    const index = this.connections.findIndex((conn) => conn.userId === userId);
    Logger.info(
      "before",
      this.connections[index].userId,
      this.connections[index].listId
    );
    if (index !== -1) this.connections[index].listId = null;
    Logger.info(
      "after",
      this.connections[index].userId,
      this.connections[index].listId
    );
  }

  private setConnection(socket: Socket, userId: string): void {
    this.connections.push({ connection: socket, userId: userId });
  }

  private getConnection(userId: string): IConnection | undefined {
    return this.connections.find((conn) => conn.userId === userId);
  }

  private removeConnection(socket: Socket) {
    const index = this.connections.findIndex(
      (conn) => conn.connection.id === socket.id
    );
    if (index !== -1) this.connections.splice(index, 1);
  }

  public broadcastToList(
    listId: string,
    senderUserId: string,
    eventName: string,
    data: any
  ) {
    if (!this.io) return;
    //const socketsInRoom = this.io.sockets.adapter.rooms.get(listId);
    this.connections.forEach((conn: IConnection) => {
      if (conn.listId === listId && conn.userId !== senderUserId) {
        conn.connection.emit(eventName, data);
      }
    });
  }

  public broadcastToUser(
    //listId: string,
    userId: string,
    eventName: string,
    data: any
  ) {
    if (!this.io) return;
    this.connections.forEach((conn: IConnection) => {
      if (conn.userId === userId) {
        conn.connection.emit(eventName, data);
      }
    });
  }
}
