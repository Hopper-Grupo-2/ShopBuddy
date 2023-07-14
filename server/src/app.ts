// server.js
import express from "express";
import http from "http";
import handleAllErrors from "./middlewares/error-handler";
import { listsRouter } from "./routers/lists";
import { usersRouter } from "./routers/users";
import { messagesRouter } from "./routers/messages";
// import { Server } from "socket.io";
// import WebsocketController from "./websocket/controller";

export default class App {
	public app: express.Application;
	public server: http.Server;

	constructor() {
		this.app = express();
		this.middleware();
		this.router();
		this.server = http.createServer(this.app);
		// this.websocket();
	}

	private middleware(): void {
		this.app.use(express.json());
		this.app.use("/", express.static("./client/dist"));
	}

	private router(): void {
		this.app.use("/api/lists", listsRouter);
		this.app.use("/api/users", usersRouter);
		this.app.use("/api/messages", messagesRouter);
		this.app.use(handleAllErrors);
	}

	// private websocket(): void {
	// 	const io = new Server(this.server);
	// 	const websocketController = new WebsocketController(io);
	// 	websocketController.initialize();
	// }
}
