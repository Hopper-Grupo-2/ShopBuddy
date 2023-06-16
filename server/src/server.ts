import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./server/config/.env" });

const PORT = process.env.PORT;
const app = express();

app.use(express.static("./client"));

// app.get("/", (req: Request, res: Response) => {
//     Express.static("../../client");
// });

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
