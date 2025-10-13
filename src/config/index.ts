import { config } from "dotenv";
config();

import { env } from "node:process";

const getEnvVariable = (
    key: string,
    options?: { defaultValue?: string }
): string => {
    const value = env[key];
    const defaultValue = options?.defaultValue;
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    if (value) {
        return value;
    }
    if (defaultValue) {
        return defaultValue;
    }
    throw `Environment variable '${key}' not found`;
};

export const DATABASE_URL = getEnvVariable("DATABASE_URL");
export const PORT = getEnvVariable("APP_PORT", { defaultValue: "3000" });
export const ENV = getEnvVariable("NODE_ENV", { defaultValue: "development" });
export const BASE_PATH = getEnvVariable("APP_BASE_PATH");
export const HRMS_URL = getEnvVariable("HRMS_URL");
export const ATTENDANCE_URL = getEnvVariable("ATTENDANCE_URL")
