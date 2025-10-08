import express, { Request, Response } from "express";
import { BASE_PATH } from "@config/index";
import { HHH } from "./routes";

const app = express();
app.use(express.json());

app.use(`/${BASE_PATH}`, HHH);

app.get("/", (req: Request, res: Response) => {
    res.send("🚀 Express backend deployed on Vercel!");
});

// ❌ Remove app.listen()
// ✅ Instead export the app
export default app;
