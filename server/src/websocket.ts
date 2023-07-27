import { Server, Socket } from "socket.io";
import IConnection from "./interfaces/connection";

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
			console.log("Client reached the server");
			this.handleEvents(socket);
		});
	}

	private handleEvents(socket: Socket) {
		// const newConnection: IConnection = {
		//     connection: socket,
		// }

		socket.on("enterList", (listId: string, userId: string) => {
			try {
				this.joinListRoom(socket, listId, userId);
				console.log("Client joined list " + listId);
			} catch (error) {
				console.error("Error joining list room: " + error);
			}
		});

		socket.on("exitList", (listId: string, userId: string) => {
			try {
				this.leaveListRoom(userId);
				console.log("Client left list " + listId);
			} catch (error) {
				console.error("Error leaving list room: " + error);
			}
		});

		socket.on("disconnect", () => {
			this.removeConnection(socket);
			console.log("Client disconnected");
		});
	}

	private joinListRoom(socket: Socket, listId: string, userId: string) {
		//socket.join(listId);
		const connection = this.getConnection(userId);
		if (connection) {
			connection.listId = listId;
			connection.userId = userId;
		} else {
			this.connections.push({ connection: socket, listId, userId });
		}
	}

	private leaveListRoom(userId: string) {
		const connection = this.getConnection(userId);
		if (connection) {
			connection.listId = null; // Unassign the list
		}
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
				console.log("websocket: sending a message...");
				conn.connection.emit(eventName, data);
			}
		});

		// if (socketsInRoom) {
		// 	socketsInRoom.forEach((socketId: string) => {
		// 		if (socketId !== senderUserId && this.io !== null) {
		// 			console.log("websocket: mandei a mensagem...");
		// 			this.io.to(socketId).emit(eventName, data);
		// 		}
		// 	});
		// }
	}
}
