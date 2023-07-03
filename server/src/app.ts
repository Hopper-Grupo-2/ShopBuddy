// server.js
import express from "express";
import http from "http";
// import { Server } from "socket.io";
// import WebsocketController from "./websocket/controller";

export default class App {
	private app: express.Application;
	public server: http.Server;

	constructor() {
		this.app = express();
		this.middleware();
		this.server = http.createServer(this.app);
		// this.websocket();
	}

	private middleware(): void {
		this.app.use(express.json());
		this.app.use("/", express.static("./client/dist"));
	}

	// private websocket(): void {
	// 	const io = new Server(this.server);
	// 	const websocketController = new WebsocketController(io);
	// 	websocketController.initialize();
	// }
}
