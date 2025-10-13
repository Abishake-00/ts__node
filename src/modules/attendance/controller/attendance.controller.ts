import { Request, Response } from "express";
import { AttendanceService } from "../service/attendance.service";
import { HRMS_URL } from "../../../config/index";

const attendanceService = new AttendanceService("",10000);

export class AttendanceController {
  static async generateMonthly(req: Request, res: Response) {
    try {
      await attendanceService.generateMonthlyAttendance();
      res.status(200).json({ success: true, message: "Monthly attendance generated" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  static async update(req: Request, res: Response) {
    try {
        const updateType = req.query.updateType as string;
        const username = req.query.username as string;
      await attendanceService.updateAttendance(updateType, username);
      res.status(200).json({ success: true, message: "Monthly attendance generated" });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async loginAndMark(req: Request, res: Response) {
    try {
        const status = req.query.status as string
      const loginResults = await attendanceService.loginAllUsers(status);
      res.status(200).json({ success: true, loginResults });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
