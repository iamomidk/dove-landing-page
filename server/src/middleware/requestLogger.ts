import pinoHttp from "pino-http";
import {logger} from "../config/logger";
import {nanoid} from "nanoid";
import {RequestHandler} from "express";

export const requestLogger: RequestHandler = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const hdr = req.headers["x-request-id"]?.toString();
        const id = hdr || nanoid(12);
        res.setHeader("X-Request-Id", id);
        return id;
    },
    customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },
    customSuccessMessage: (_req, res, responseTime) => `request completed with status ${res.statusCode} in ${responseTime}ms`,
    customErrorMessage: (_req, res) => `request errored with status ${res.statusCode}`
});