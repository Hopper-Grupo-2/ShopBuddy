import { Socket } from "socket.io";

export default interface IConnection {
	connection: Socket;
	userId?: string;
	listId?: string;
}
