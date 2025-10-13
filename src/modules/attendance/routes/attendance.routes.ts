import { Router } from "express";
import { AttendanceController } from "../controller/attendance.controller";

const router = Router();

router.get("/generate", AttendanceController.generateMonthly);
router.get("/update", AttendanceController.update);
router.get("/login-and-mark", AttendanceController.loginAndMark);

export default router;
