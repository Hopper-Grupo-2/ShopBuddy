import dotenv from "dotenv";
dotenv.config({ path: "./server/config/.env" });

// server.js
import App from "./src/app";
import connectDB from "./src/database/mongodb";
const app = new App();

const PORT = Number(process.env.PORT) || 443; // https
const HOST = process.env.HOST || "localhost";

connectDB();

const PORT_HTTP = 80;

app.serverhttps.listen(PORT, HOST, () => {
    console.log(`HTTPS Server is running on https://${HOST}:${PORT}`);
});

app.server.listen(PORT_HTTP, () => {
    console.log(`HTTP Server is running on http://${HOST}:${PORT_HTTP}`);
});
