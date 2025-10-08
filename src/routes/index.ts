import { Router } from "express";
// import { baseAuth } from "@middleware/auth";
import attendanceRouter from "../modules/attendance/routes/attendance.routes";

const routes = Router();

// routes.use("/shop", shopRouter); // Shop module not implemented yet
routes.use("/attendance", attendanceRouter);

export { routes as HHH };
