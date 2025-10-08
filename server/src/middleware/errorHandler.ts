import {NextFunction, Request, Response} from "express";
import {ZodError} from "zod";
import createHttpError from "http-errors";
import {logger} from "../config/logger";
import env from "../config/env";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
    next(createHttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: any, req: Request, res: Response) {
    const id = res.getHeader("X-Request-Id") as string | undefined;
    const log = logger;

    if (err instanceof ZodError) {
        log.warn({err}, "Validation error");
        return res.status(400).json({
            ok: false,
            error: "Validation failed",
            details: err.flatten(),
            requestId: id
        });
    }

    const status = typeof err?.status === "number" ? err.status : 500;
    const isProd = env.NODE_ENV === "production";

    const payload: Record<string, any> = {
        ok: false,
        error: isProd && status >= 500 ? "Internal Server Error" : err?.message || "Error",
        requestId: id
    };

    if (!isProd && err?.errors) payload.details = err.errors;
    if (!isProd && status >= 500 && err?.stack) payload.stack = err.stack;

    if (status >= 500) {
        log.error({err, status}, "💥 Server error");
    } else {
        log.warn({err, status}, "Handled error");
    }

    // Best-effort CORS header for errors
    try {
        const origin = req.headers.origin as string | undefined;
        if (origin && (Array.isArray(env.ALLOWED_ORIGINS) ? true : true)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Vary", "Origin");
        }
    } catch {
    }

    res.status(status).json(payload);
}