import { HRMS_URL } from "../../../config/index";
import { PrismaClient } from "@prisma/client";

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

    async login(username: string, password: string): Promise<string> {
        try {
            const response = await this.fetchWithTimeout(HRMS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            const data: LoginResponse = await response.json();

            if (data.success) {
                const token =
                    data.data?.token ||
                    data.data?.accessToken ||
                    (data as any).token;

                if (!token) {
                    throw new Error("No token received from login response");
                }

                return token;
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (error: any) {
            console.error(`Login failed:`, error.message);
            throw error;
        }
    }

    async markAttendance(
        token: string,
        payload: AttendancePayload,
        timeout: 20000
    ) {
        const ATTENDANCE_URL = `${HRMS_URL.replace(
            "/auth/login",
            "/attendance"
        )}`;
    }
}
