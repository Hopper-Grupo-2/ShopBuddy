import dotenv from "dotenv";
dotenv.config({ path: "./server/config/.env" });

// server.js
import App from "./src/app";
const app = new App();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.server.listen(PORT, () => {
	console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
