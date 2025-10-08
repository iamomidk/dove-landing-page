import pino from "pino";
import env from "./env";

const LOG_LEVEL = process.env.LOG_LEVEL || (env.NODE_ENV === "production" ? "info" : "debug");

export const logger = pino({
        level: LOG_LEVEL,
        ...(env.NODE_ENV !== "production" ? {
            transport: {
                target: "pino-pretty",
                options: {colorize: true, translateTime: "SYS:standard", singleLine: true}
            }
        } : {})
    }
);