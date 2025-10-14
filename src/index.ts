import express, { Request, Response } from "express";
import { BASE_PATH, ENV } from "./config/index";
import { HHH } from "./routes";
import cron from "node-cron";
import { AttendanceService } from "./modules/attendance/service/attendance.service";
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(`/${BASE_PATH}`, HHH);

const port = Number(process.env.PORT) || 3000;

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.get("/health2", (_req, res) => {
    res.json({ status: "ok 2" });
});
 app.get("/health4", (_req, res) => {
    res.json({ status: "ok 3" });
});
const attendanceService = new AttendanceService("",10000);

cron.schedule("0 0 1 * *", async () => {
  console.log("🕛 Running monthly attendance cron job...");
  try {
    attendanceService.generateMonthlyAttendance()
    console.log("✅ Monthly attendance generated successfully!");
  } catch (error) {
    console.error("❌ Error generating attendance:", error);
  }
});
function getRandomMinute(startMinute: number, endMinute: number): number {
  return Math.floor(Math.random() * (endMinute - startMinute)) + startMinute;
}

// 1️⃣ Morning check-in (random 09:50–10:05)
const checkInMinute = getRandomMinute(50, 55); // 50..54
cron.schedule(`${checkInMinute} * * * *`, async () => {
  console.log(`🕘 Running check-in cron at random minute ${checkInMinute} ${new Date().toDateString()}`);
  try {
    await attendanceService.loginAllUsers("in");
  } catch (error) {
    console.error("❌ Error in check-in cron:", error);
  }
}, {
  timezone: "Asia/Kolkata"
});

// 2️⃣ Evening check-out (random 18:00–18:10)
const checkOutMinute = getRandomMinute(0, 10); // 0..9
cron.schedule(`${checkOutMinute} 18 * * *`, async () => {
  console.log(`🕕 Running check-out cron at random minute ${checkOutMinute}`);
  try {
    await attendanceService.loginAllUsers("out");
  } catch (error) {
    console.error("❌ Error in check-out cron:", error);
  }
}, {
  timezone: "Asia/Kolkata"
});


app.listen(port, "0.0.0.0", () => {
    console.log(
        `✅ Server is running on port ${port} in ${ENV || "development"} mode`
    );
});
