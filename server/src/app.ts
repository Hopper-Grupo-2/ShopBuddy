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
import { notificationsRouter } from "./routers/notifications";
import { invitesRouter } from "./routers/invites";
import { cacheRouter } from "./routers/cache";

import loggerInfoClient from "./middlewares/logger-info-client";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

const options = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Shop Buddy API",
  customfavIcon: "/assets/favicon.ico",
};
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
    this.app.use(loggerInfoClient);
  }

  private router(): void {
    this.app.use("/api/lists", listsRouter);
    this.app.use("/api/users", usersRouter);
    this.app.use("/api/messages", messagesRouter);
    this.app.use("/api/notifications", notificationsRouter);
    this.app.use("/api/invites", invitesRouter);
    this.app.use("/api/cache", cacheRouter);
    this.app.use(handleAllErrors);
    this.app.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );
  }

  private fallback(): void {
    this.app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../../client/dist", "index.html"));
    });
  }

  private websocket(): void {
    const io = new Server(this.server);
    const websocket = Websocket.getIstance();
    websocket.setIO(io);
    websocket.initialize();
  }
}
