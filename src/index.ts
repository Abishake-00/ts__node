import express, { Request, Response } from "express";
import { BASE_PATH, ENV } from "./config/index";
import { HHH } from "./routes";

const app = express();

app.use(express.json());
app.use(`/${BASE_PATH}`, HHH);

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
    console.log(
        `✅ Server is running on port ${port} in ${ENV || "development"} mode`
    );
});
