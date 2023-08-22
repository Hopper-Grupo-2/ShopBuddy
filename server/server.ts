import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import Logger from "./src/log/logger";

// server.js
import App from "./src/app";
import connectDB from "./src/database/mongodb";
const app = new App();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

connectDB();

app.server.listen(PORT, () => {
  Logger.info(`Servidor rodando em http://${HOST}:${PORT}`);
});
