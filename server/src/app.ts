// server.js
import express from "express";
import path from "path";
import http from "http";
import handleAllErrors from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { listsRouter } from "./routers/lists";
import { usersRouter } from "./routers/users";
import { messagesRouter } from "./routers/messages";
import { Server } from "socket.io";
import Websocket from "./websocket";
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
		this.websocket();
		this.fallback();
	}

	private middleware(): void {
		//this.app.use(cors());
		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use("/", express.static("./client/dist"));
	}

	private router(): void {
		this.app.use("/api/lists", listsRouter);
		this.app.use("/api/users", usersRouter);
		this.app.use("/api/messages", messagesRouter);
		this.app.use(handleAllErrors);
	}

	private fallback(): void {
		this.app.get("*", (req, res) => {
			res.sendFile(
				path.resolve(__dirname, "../../client/dist", "index.html")
			);
		});
	}

	private websocket(): void {
		const io = new Server(this.server);
		const websocket = Websocket.getIstance();
		websocket.setIO(io);
		websocket.initialize();
	}
}
