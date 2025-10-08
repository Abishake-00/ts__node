import express, { Request, Response } from "express";
import { BASE_PATH, ENV, PORT } from "./config/index";
import { HHH } from "./routes";

const app = express();

app.use(express.json());

app.use(`/${BASE_PATH}`, HHH);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`PORT at: ${PORT}`);
});
