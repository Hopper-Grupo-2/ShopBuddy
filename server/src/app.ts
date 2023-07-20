// server.js
import express from "express";
import http from "http";
import handleAllErrors from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import { listsRouter } from "./routers/lists";
import { usersRouter } from "./routers/users";
import { messagesRouter } from "./routers/messages";
import https from "https";
import fs from "fs";
// import { Server } from "socket.io";
// import WebsocketController from "./websocket/controller";

export default class App {
    public app: express.Application;
    public server: http.Server;
    public serverhttps: https.Server;
    private options: { key: Buffer; cert: Buffer };
    public PORT_HTTPS = 443;

    constructor() {
        this.app = express();
        this.middleware();
        this.router();
        this.server = http.createServer(this.app);

        //add key/openssl
        this.options = {
            key: fs.readFileSync("ssl/chave-privada.pem"),
            cert: fs.readFileSync("ssl/certificado.pem"),
        };
        this.serverhttps = https.createServer(this.options, this.app);
        // this.websocket();
    }

    private middleware(): void {
        //redirect first of all
        this.app.use((req, res, next) => {
            if (req.secure) {
                // If already HTTPS, continue to the next middleware
                next();
            } else {
                // Redirect to HTTPS
                res.redirect(
                    `https://${req.hostname}:${this.PORT_HTTPS}${req.url}`
                );
            }
        });

        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use("/", express.static("./client/dist"));
        //
        this.app.use((req, res, next) => {
            res.setHeader(
                "Content-Security-Policy",
                "default-src 'self'; img-src 'self' data:;"
            );
            next();
        });
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
