import { ATTENDANCE_URL, HRMS_URL } from "../../../config/index";
import { PrismaClient } from "@prisma/client";
import {
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    getWeekOfMonth,
    setSeconds,
    setMinutes,
    setHours,
} from "date-fns";
const prisma = new PrismaClient();

interface LoginResponse {
    success: boolean;
    data: {
        token?: string;
        accessToken?: string;
    };
    message?: string;
}

interface AttendancePayload {
    status: "check_in" | "check_out";
    lat: string;
    lng: string;
    attendanceLocTypeId?: number;
    deviceId?: string;
}

export class AttendanceService {
    private timeout: number;

    constructor(baseUrl: string, timeout: number = 10000) {
        this.timeout = timeout;
    }

    private async fetchWithTimeout(
        url: string,
        options: RequestInit
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        return response;
    }

    // async loginAllUsers(status : string) {
    //   const users = await prisma.user.findMany();
    //   const deviceType = "android";

    //   const loginPromises = users.map(async (user) => {
    //     const {
    //       id,
    //       username,
    //       password,
    //       userDeviceId,
    //       homeLat,
    //       homeLng,
    //       officeLat,
    //       officeLng,
    //     } = user;

    //     try {
    //       // Step 1️⃣: Login
    //       const loginRes = await this.fetchWithTimeout(HRMS_URL, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "User-Agent": "Dart/3.7 (dart:io)",
    //         },
    //         body: JSON.stringify({
    //           username,
    //           password,
    //           deviceType,
    //           deviceId: userDeviceId,
    //         }),
    //       });

    //       if (!loginRes.ok) {
    //         const errData = await loginRes.json().catch(() => ({}));
    //         console.warn(`❌ Login failed for ${username}: ${errData.message || loginRes.status}`);
    //         return { username, success: false };
    //       }

    //       const data: LoginResponse = await loginRes.json();
    //       const token = data.data?.token || data.data?.accessToken || (data as any).token;

    //       if (!token) {
    //         console.warn(`⚠️ No token for ${username}`);
    //         return { username, success: false };
    //       }

    //       console.log(`✅ Logged in: ${username}`);

    //       // Step 2️⃣: Find today's attendance entry
    //       // const today = new Date().toLocaleDateString('en-US').replace(/\//g, '-');
    //       const today = new Date();
    //       const istToday = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    //       const month = String(istToday.getMonth() + 1).padStart(2, '0');
    //       const day = String(istToday.getDate()).padStart(2, '0');
    //       const year = istToday.getFullYear();
    //       const todayStr = `${month}-${day}-${year}`;

    //       const todaysData = await prisma.attendanceData.findFirst({
    //         where: {
    //           userId: id,
    //           date: todayStr,
    //           type : status === "in" ? "check_in" :"check_out"
    //         },
    //       });

    //       if (!todaysData) {
    //         console.warn(`⚠️ No attendance record for${today} ${username} today `);
    //         return { username, success: true, token, skipped: true };
    //       }

    //       if (todaysData.isLeave) {
    //         console.log(`🏖 ${username} is on leave today`);
    //         return { username, success: true, token, skipped: true };
    //       }

    //       // Step 3️⃣: Determine correct coordinates based on work mode
    //       const isOffice = todaysData.attendanceType === "OFFICE" ;
    //       const lat = isOffice ? officeLat : homeLat;
    //       const lng = isOffice ? officeLng : homeLng;
    //       try {
    //       // Step 4️⃣: Mark attendance
    //       const attRes = await this.fetchWithTimeout(ATTENDANCE_URL, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           "User-Agent": "Dart/3.7 (dart:io)",
    //           "Authorization": `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({
    //           lat,
    //           lng,
    //           attendanceLocTypeId: todaysData.attendanceLocTypeId === true ? 2 : 5,
    //           status : todaysData.type
    //         }),
    //       });
    //       // console.log(attRes);
    //       if (!attRes.ok) {
    //         const errData = await attRes.json().catch(() => ({}));
    //         console.error(`💥 Attendance mark failed for ${username}: ${errData.message || attRes.status}`);
    //         return { username, success: false, token, error: errData.message };
    //       }
    //       } catch (err) {
    //         console.error(`💥 Network error for ${username}:`, err);
    //       }

    //       console.log(`🕒 Attendance marked for ${username}`);
    //       return { username, success: true, token };
    //     } catch (error: any) {
    //       console.error(`💥 Error for ${username}:`, error.message);
    //       return { username, success: false, error: error.message };
    //     }
    //   });

    //   // Run all logins concurrently
    //   const results = await Promise.all(loginPromises);
    //   const successful = results.filter((r) => r.success);

    //   console.log(`✅ ${successful.length}/${users.length} users processed successfully`);
    //   return results;
    // }

    async loginAllUsers(status: string) {
        const users = await prisma.user.findMany();
        const deviceType = "android";

        const loginPromises = users.map(async (user) => {
            const {
                id,
                username,
                password,
                userDeviceId,
                homeLat,
                homeLng,
                officeLat,
                officeLng,
            } = user;

            try {
                // Step 1️⃣: Login
                const loginRes = await this.fetchWithTimeout(HRMS_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "Dart/3.7 (dart:io)",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        deviceType,
                        deviceId: userDeviceId,
                    }),
                });

                if (!loginRes.ok) {
                    const errData = await loginRes.json().catch(() => ({}));
                    console.warn(
                        `❌ Login failed for ${username}: ${
                            errData.message || loginRes.status
                        }`
                    );
                    return { username, success: false };
                }

                const data: LoginResponse = await loginRes.json();
                const token =
                    data.data?.token ||
                    data.data?.accessToken ||
                    (data as any).token;

                if (!token) {
                    console.warn(`⚠️ No token for ${username}`);
                    return { username, success: false };
                }

                console.log(`✅ Logged in: ${username}`);

                // Step 2️⃣: Find today's attendance entry
                const today = new Date();
                const istToday = new Date(
                    today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                );
                const month = String(istToday.getMonth() + 1).padStart(2, "0");
                const day = String(istToday.getDate()).padStart(2, "0");
                const year = istToday.getFullYear();
                const todayStr = `${month}-${day}-${year}`;

                const todaysData = await prisma.attendanceData.findFirst({
                    where: {
                        userId: id,
                        date: todayStr,
                        type: status === "in" ? "check_in" : "check_out",
                    },
                    select: {
                        id: true,
                        type: true,
                        attendanceType: true,
                        attendanceLocTypeId: true,
                        isLeave: true,
                    },
                });

                if (!todaysData) {
                    console.warn(
                        `⚠️ No attendance record for ${username} on ${todayStr} with type ${
                            status === "in" ? "check_in" : "check_out"
                        }`
                    );
                    return { username, success: true, token, skipped: true };
                }

                if (todaysData.isLeave) {
                    console.log(`🏖 ${username} is on leave today`);
                    return { username, success: true, token, skipped: true };
                }

                // Step 3️⃣: Determine correct coordinates based on work mode
                const isOffice = todaysData.attendanceType === "OFFICE";
                const lat = isOffice ? officeLat : homeLat;
                const lng = isOffice ? officeLng : homeLng;

                // ✅ Validate coordinates before proceeding
                if (!lat || !lng || lat === "" || lng === "") {
                    console.error(
                        `❌ Invalid coordinates for ${username}: lat=${lat}, lng=${lng}, mode=${
                            isOffice ? "OFFICE" : "WFH"
                        }`
                    );
                    return {
                        username,
                        success: false,
                        error: "Invalid coordinates",
                        skipped: true,
                    };
                }

                // 🪶 Debug logs before hitting API
                console.log("🚀 About to hit ATTENDANCE_URL for:", username);
                console.log("➡️ Status being sent:", todaysData.type);
                console.log("📍 Coordinates:", { lat, lng });
                console.log(
                    "📍 attendanceLocTypeId (raw):",
                    todaysData.attendanceLocTypeId
                );
                console.log("🪪 Token (first 10 chars):", token?.slice(0, 10));

                const payload = {
                    lat,
                    lng,
                    attendanceLocTypeId:
                        todaysData.attendanceLocTypeId === true ? 2 : 5,
                    status: todaysData.type,
                };

                console.log("🌍 Payload:", JSON.stringify(payload));

                try {
                    // Step 4️⃣: Mark attendance
                    const attRes = await this.fetchWithTimeout(ATTENDANCE_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "User-Agent": "Dart/3.7 (dart:io)",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    });

                    console.log(
                        "📡 Response received for",
                        username,
                        ":",
                        attRes.status
                    );

                    if (!attRes.ok) {
                        const errData = await attRes.json().catch(() => ({}));
                        console.error(
                            `💥 Attendance mark failed for ${username}: Status ${attRes.status}`
                        );
                        console.error(
                            `💥 Error details:`,
                            JSON.stringify(errData)
                        );
                        console.error(
                            `💥 Request payload was:`,
                            JSON.stringify(payload)
                        );
                        return {
                            username,
                            success: false,
                            token,
                            error: errData.message || `HTTP ${attRes.status}`,
                        };
                    }

                    const successData = await attRes.json().catch(() => ({}));
                    console.log(
                        `✅ Success response for ${username}:`,
                        JSON.stringify(successData)
                    );
                } catch (err: any) {
                    console.error(
                        `💥 Network error for ${username}:`,
                        err?.message || err
                    );
                    console.error(`💥 Stack trace:`, err?.stack);
                    return {
                        username,
                        success: false,
                        error: err?.message || String(err),
                    };
                }

                console.log(`🕒 Attendance marked for ${username}`);
                return { username, success: true, token };
            } catch (error: any) {
                console.error(`💥 Error for ${username}:`, error.message);
                return { username, success: false, error: error.message };
            }
        });

        // Run all logins concurrently
        const results = await Promise.all(loginPromises);
        const successful = results.filter((r) => r.success);

        console.log(
            `✅ ${successful.length}/${users.length} users processed successfully`
        );
        return results;
    }

    async randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public async generateMonthlyAttendance() {
        const users = await prisma.user.findMany();

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-based month
        const totalDays = new Date(year, month + 1, 0).getDate(); // total days in month

        // Generate all days in `MM-DD-YYYY` format
        const daysArray = Array.from({ length: totalDays }, (_, i) => {
            const d = new Date(year, month, i + 1);
            const monthStr = String(d.getMonth() + 1).padStart(2, "0");
            const dayStr = String(d.getDate()).padStart(2, "0");
            const yearStr = d.getFullYear();
            return `${monthStr}-${dayStr}-${yearStr}`;
        });

        for (const user of users) {
            const userId = user.id;

            // ✅ Check if user already has *any* attendance record this month
            const existingMonth = await prisma.attendanceData.findFirst({
                where: {
                    userId,
                    date: {
                        gte: `${String(month + 1).padStart(2, "0")}-01-${year}`,
                        lte: `${String(month + 1).padStart(
                            2,
                            "0"
                        )}-${totalDays}-${year}`,
                    },
                },
            });

            if (existingMonth) {
                console.log(
                    `⏹ Attendance already exists for ${user.username}, skipping.`
                );
                continue;
            }

            const bulkData: any[] = [];

            for (const date of daysArray) {
                const [m, d, y] = date.split("-");
                const dateObj = new Date(`${y}-${m}-${d}`);

                const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
                const dayOfMonth = dateObj.getDate();
                const weekOfMonth = Math.ceil(dayOfMonth / 7);

                let attendanceType: "OFFICE" | "WFH" | "LEAVE" = "OFFICE";
                let attendanceLocTypeId = true;
                let isLeave = false;

                // Sunday = Leave
                if (dayOfWeek === 0) {
                    attendanceType = "LEAVE";
                    attendanceLocTypeId = false;
                    isLeave = true;
                }
                // Alternate Saturdays
                else if (dayOfWeek === 6) {
                    if ([1, 3, 5].includes(weekOfMonth)) {
                        attendanceType = "WFH";
                        attendanceLocTypeId = false;
                    } else {
                        attendanceType = "LEAVE";
                        attendanceLocTypeId = false;
                        isLeave = true;
                    }
                }

                // Create both check-in and check-out
                bulkData.push(
                    {
                        userId,
                        date,
                        type: "check_in",
                        attendanceType,
                        attendanceLocTypeId,
                        isLeave,
                    },
                    {
                        userId,
                        date,
                        type: "check_out",
                        attendanceType,
                        attendanceLocTypeId,
                        isLeave,
                    }
                );
            }

            await prisma.attendanceData.createMany({ data: bulkData });
            console.log(`✅ Attendance generated for ${user.username}`);
        }

        console.log("🎯 Monthly attendance generation completed!");
    }

    async updateAttendance(updateType: string, username: string) {
        const today = new Date();
        const monthStr = String(today.getMonth() + 1).padStart(2, "0");
        const dayStr = String(today.getDate()).padStart(2, "0");
        const yearStr = today.getFullYear();
        const dateStr = `${monthStr}-${dayStr}-${yearStr}`;

        // Update multiple attendance records for today
        const updateData =
            updateType === "WFH"
                ? { attendanceType: "WFH", attendanceLocTypeId: false }
                : { isLeave: true };

        const result = await prisma.attendanceData.updateMany({
            where: {
                date: dateStr,
                user: { username },
            },
            data: updateData,
        });

        if (result.count === 0) {
            throw new Error(
                `Attendance not found for user ${username} on ${dateStr}`
            );
        }

        return `✅ Attendance updated for ${username} on ${dateStr}`;
    }
}
