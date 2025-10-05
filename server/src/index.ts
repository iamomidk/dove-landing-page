// src/index.ts
import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import {nanoid} from "nanoid";
import Kavenegar = require("kavenegar");
import {z, ZodError} from "zod";
import Redis from "ioredis";
import {S3Client, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import pino from "pino";
import pinoHttp from "pino-http";
import createHttpError from "http-errors";

/* ------------------------------------
 * Config
 * ------------------------------------ */
const PORT = Number(process.env.PORT || 4000);
const OTP_TTL = Number(process.env.OTP_TTL_SECONDS ?? 300);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS ?? 5);
const SEND_LIMIT_PER_PHONE = Number(process.env.SEND_LIMIT_PER_PHONE ?? 3);
const SEND_WINDOW_SECONDS = Number(process.env.SEND_WINDOW_SECONDS ?? 600);
const SEND_LIMIT_PER_IP = Number(process.env.SEND_LIMIT_PER_IP ?? 10);
const SEND_IP_WINDOW_SECONDS = Number(process.env.SEND_IP_WINDOW_SECONDS ?? 600);
const VERIFY_LIMIT_PER_IP = Number(process.env.VERIFY_LIMIT_PER_IP ?? 30);
const VERIFY_IP_WINDOW_SECONDS = Number(process.env.VERIFY_IP_WINDOW_SECONDS ?? 600);
const OTP_SEND_MODE = (process.env.OTP_SEND_MODE || "kavenegar").toLowerCase(); // "kavenegar" | "log" | "mock"
const IR_MOBILE = /^0?9\d{9}$/;
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

/* ------------------------------------
 * Logger
 * ------------------------------------ */
const logger = pino({
    level: LOG_LEVEL,
    ...(process.env.NODE_ENV !== "production"
        ? {
            transport: {
                target: "pino-pretty",
                options: {colorize: true, translateTime: "SYS:standard", singleLine: true},
            },
        }
        : {}),
});

/* ------------------------------------
 * App & Middleware
 * ------------------------------------ */
const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

// Structured request logging w/ requestId
app.use(
    pinoHttp({
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
        customSuccessMessage: (_req, res, responseTime) =>
            `request completed with status ${res.statusCode} in ${responseTime}ms`,
        customErrorMessage: (_req, res, _err) =>
            `request errored with status ${res.statusCode}`,
    })
);
;

// Attach a convenience child logger on res.locals
app.use((req, res, next) => {
    res.locals.requestId = (req as any).id;
    res.locals.log = (req as any).log.child({requestId: res.locals.requestId});
    next();
});

app.use(helmet());
app.use(compression());
app.use(express.json({limit: "10kb", type: ["application/json", "application/*+json"]}));

/* ---------- CORS (allow-list, normalized; no trailing slashes) ---------- */
function normalizeOrigin(o?: string | null) {
    if (!o) return "";
    return o.trim().replace(/\/+$/, "");
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        const log = logger.child({scope: "cors"});
        log.debug({origin}, "CORS check");
        if (!origin) return callback(null, true);
        const clean = normalizeOrigin(origin);
        if (ALLOWED_ORIGINS.includes(clean)) return callback(null, true);
        log.warn({origin}, "CORS rejected");
        const err = Object.assign(new Error(`CORS: Origin ${origin} is not allowed`), {status: 403});
        callback(err as any);
    },
    methods: ["GET", "HEAD", "OPTIONS", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: false,
    maxAge: 86400,
};
logger.info({allowlist: ALLOWED_ORIGINS}, "CORS allowlist");
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((_, res, next) => {
    res.header("Vary", "Origin");
    next();
});

/* ------------------------------------
 * Redis
 * ------------------------------------ */
const redis = new Redis(process.env.REDIS_URL!);
redis.on("connect", () => logger.info("✅ Redis connected"));
redis.on("ready", () => logger.debug("Redis ready"));
redis.on("reconnecting", () => logger.warn("Redis reconnecting..."));
redis.on("end", () => logger.warn("Redis connection closed"));
redis.on("error", (e) => logger.error({err: e}, "❌ Redis error"));

/* ------------------------------------
 * Kavenegar
 * ------------------------------------ */
const kavenegar =
    OTP_SEND_MODE === "kavenegar" ? Kavenegar.KavenegarApi({apikey: process.env.KAVENEGAR_API_KEY!}) : null;

/* ------------------------------------
 * Liara S3
 * ------------------------------------ */
function requireEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing required env var: ${name}`);
    return v;
}

const LIARA_ENDPOINT = requireEnv("LIARA_ENDPOINT");
const LIARA_BUCKET_NAME = requireEnv("LIARA_BUCKET_NAME");
const LIARA_ACCESS_KEY = requireEnv("LIARA_ACCESS_KEY");
const LIARA_SECRET_KEY = requireEnv("LIARA_SECRET_KEY");
const LIARA_REGION = process.env.LIARA_REGION ?? "default";

export const s3 = new S3Client({
    region: LIARA_REGION,
    endpoint: LIARA_ENDPOINT,
    credentials: {accessKeyId: LIARA_ACCESS_KEY, secretAccessKey: LIARA_SECRET_KEY},
    forcePathStyle: true,
});

/* ------------------------------------
 * Helpers & Validation
 * ------------------------------------ */
const phoneSchema = z.object({phone: z.string().regex(IR_MOBILE)});
const sendSchema = phoneSchema.extend({fullName: z.string().min(2)});
const verifySchema = phoneSchema.extend({code: z.string().length(4).regex(/^\d{4}$/)});
const videoQuerySchema = z.object({key: z.string().min(1).refine((v) => !v.includes(".."), "invalid key")});

const normPhone = (p: string) => (p.startsWith("0") ? p : `0${p}`);
const genCode = () => String(Math.floor(1000 + Math.random() * 9000));
const clientIp = (req: Request) =>
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "0.0.0.0";

const ah =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any) =>
        (req: Request, res: Response, next: NextFunction) =>
            Promise.resolve(fn(req, res, next)).catch(next);

async function rateLimitHit(key: string, limit: number, windowSec: number) {
    const script = `
    local c = redis.call("INCR", KEYS[1])
    if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
    return c
  `;
    // @ts-ignore — ioredis eval typing
    const count = await (redis as any).eval(script, 1, key, windowSec);
    return Number(count) > limit;
}

// Redis keys
const kOtp = (p: string) => `otp:${p}:code`;
const kExp = (p: string) => `otp:${p}:exp`;
const kAtt = (p: string) => `otp:${p}:attempts`;
const kSendPhone = (p: string) => `rl:send:phone:${p}`;
const kSendIp = (addr: string) => `rl:send:ip:${addr}`;
const kVerifyIp = (addr: string) => `rl:verify:ip:${addr}`;

// Kavenegar (with timeout + detailed diagnostics)
function sendSms({
                     receptor,
                     token,
                     template,
                 }: {
    receptor: string;
    token: string;
    template: string;
}) {
    const log = logger.child({scope: "sms", receptor, template});
    if (OTP_SEND_MODE === "mock") {
        log.info({token}, "🔔 [MOCK SMS]");
        return Promise.resolve();
    }
    if (OTP_SEND_MODE === "log") {
        log.info({token}, "🔔 [LOG SMS] (no external call)");
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const timer = setTimeout(() => {
            const err = new Error("Kavenegar timeout");
            log.error({err, ms: Date.now() - start}, "SMS send failed");
            reject(err);
        }, 10_000);

        kavenegar!.VerifyLookup({receptor, token, template}, (resp: any, status: number) => {
            clearTimeout(timer);
            const ms = Date.now() - start;

            const kStatus = resp?.return?.status;   // Kavenegar business status (e.g., 200, 426, ...)
            const kMessage = resp?.return?.message; // Human-readable message from Kavenegar

            const okTransport = status >= 200 && status < 300;
            const okBusiness = kStatus === 200;

            if (okTransport && okBusiness) {
                log.info({status, kStatus, kMessage, ms}, "SMS sent");
                return resolve();
            }

            const err: any = Object.assign(new Error("sms send failed"), {
                status,
                kStatus,
                kMessage,
                resp,
            });
            log.error({err, status, kStatus, kMessage, ms}, "SMS send failed");
            reject(err);
        });
    });
}

/* ------------------------------------
 * Routes
 * ------------------------------------ */

// Liveness
app.get(
    "/health",
    ah(async (_req: Request, res: Response) => res.status(200).send("ok"))
);

// Readiness (checks Redis)
app.get(
    "/ready",
    ah(async (_req: Request, res: Response) => {
        const pong = await redis.ping();
        if (pong !== "PONG") return res.status(503).json({ok: false});
        res.json({ok: true});
    })
);

// Signed video URL (Liara)
app.get(
    "/api/video-url",
    ah(async (req: Request, res: Response) => {
        const parse = videoQuerySchema.safeParse({key: req.query.key ?? "input.mp4"});
        if (!parse.success) throw createHttpError(400, "bad key", {errors: parse.error.flatten()});

        const key = parse.data.key;
        const log = res.locals.log.child({scope: "video", key});
        log.debug("Generating signed URL");

        const cmd = new GetObjectCommand({Bucket: LIARA_BUCKET_NAME, Key: key});
        const url = await getSignedUrl(s3, cmd, {expiresIn: 60});
        res.setHeader("Cache-Control", "private, max-age=30");
        log.info({expiresIn: 60}, "Signed URL generated");
        res.json({url});
    })
);

// Send OTP
app.post(
    "/api/otp/send",
    ah(async (req: Request, res: Response) => {
        const parsed = sendSchema.safeParse(req.body);
        if (!parsed.success) throw createHttpError(400, "Bad payload", {errors: parsed.error.flatten()});

        const phone = normPhone(parsed.data.phone);
        const fullName = parsed.data.fullName;
        const ip = clientIp(req);
        const log = res.locals.log.child({scope: "otp_send", phone, ip});

        // Rate limits
        if (await rateLimitHit(kSendPhone(phone), SEND_LIMIT_PER_PHONE, SEND_WINDOW_SECONDS)) {
            log.warn({limit: SEND_LIMIT_PER_PHONE, window: SEND_WINDOW_SECONDS}, "Phone rate limit hit");
            throw createHttpError(429, "ارسال بیش از حد، لطفا بعدا تلاش کنید.");
        }
        if (await rateLimitHit(kSendIp(ip), SEND_LIMIT_PER_IP, SEND_IP_WINDOW_SECONDS)) {
            log.warn({limit: SEND_LIMIT_PER_IP, window: SEND_IP_WINDOW_SECONDS}, "IP rate limit hit (send)");
            throw createHttpError(429, "تعداد درخواست زیاد از IP، لطفا بعدا تلاش کنید.");
        }

        const code = genCode();
        const expiresAt = Date.now() + OTP_TTL * 1000;

        await Promise.all([
            redis.set(kOtp(phone), code, "EX", OTP_TTL),
            redis.set(kExp(phone), String(expiresAt), "EX", OTP_TTL),
            redis.del(kAtt(phone)),
        ]);

        log.info({fullName, ttl: OTP_TTL}, "OTP generated");

        try {
            await sendSms({
                receptor: phone,
                token: code,
                template: "dove-otp",
            });
        } catch (e) {
            // Revert OTP state on failure
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            log.error({err: e}, "Kavenegar send failed — OTP state reverted");
            throw createHttpError(502, "مشکل در ارسال پیامک");
        }

        res.json({ok: true, ttl: OTP_TTL});
    })
);

// Verify OTP
app.post(
    "/api/otp/verify",
    ah(async (req: Request, res: Response) => {
        const parsed = verifySchema.safeParse(req.body);
        if (!parsed.success) throw createHttpError(400, "Bad payload", {errors: parsed.error.flatten()});

        const phone = normPhone(parsed.data.phone);
        const codeAttempt = parsed.data.code;
        const ip = clientIp(req);
        const log = res.locals.log.child({scope: "otp_verify", phone, ip});

        if (await rateLimitHit(kVerifyIp(ip), VERIFY_LIMIT_PER_IP, VERIFY_IP_WINDOW_SECONDS)) {
            log.warn({limit: VERIFY_LIMIT_PER_IP, window: VERIFY_IP_WINDOW_SECONDS}, "IP rate limit hit (verify)");
            throw createHttpError(429, "تلاش‌های زیاد، لطفا بعدا تلاش کنید.");
        }

        const [code, expStr] = await redis.mget(kOtp(phone), kExp(phone));
        if (!code || !expStr) {
            log.warn("Verify failed — code missing or expired");
            throw createHttpError(400, "کد منقضی شده یا ارسال نشده است");
        }

        if (Date.now() > Number(expStr)) {
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            log.warn("Verify failed — code expired");
            throw createHttpError(400, "کد منقضی شده است");
        }

        const attempts = Number((await redis.get(kAtt(phone))) || 0);
        if (attempts >= OTP_MAX_ATTEMPTS) {
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            log.warn({attempts}, "Verify failed — too many attempts");
            throw createHttpError(429, "تلاش‌های بیش از حد");
        }

        if (codeAttempt !== code) {
            await redis.incr(kAtt(phone));
            await redis.expire(kAtt(phone), Math.max(30, Math.min(OTP_TTL, 300)));
            log.warn({attempts: attempts + 1}, "Verify failed — wrong code");
            throw createHttpError(400, "کد وارد شده نادرست است");
        }

        await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
        log.info("OTP verified");
        res.json({ok: true});
    })
);

/* ------------------------------------
 * 404 Not Found (after routes)
 * ------------------------------------ */
app.use((req, _res, next) => {
    next(createHttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

/* ------------------------------------
 * Error handler (last)
 * ------------------------------------ */
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const id = res.locals.requestId || (req as any).id;
    const log = res.locals.log || logger;

    // Zod errors => 400 with details
    if (err instanceof ZodError) {
        log.warn({err}, "Validation error");
        return res.status(400).json({
            ok: false,
            error: "Validation failed",
            details: err.flatten(),
            requestId: id,
        });
    }

    const status = typeof err?.status === "number" ? err.status : 500;

    // Avoid leaking internals in production
    const isProd = process.env.NODE_ENV === "production";
    const payload: Record<string, any> = {
        ok: false,
        error: isProd && status >= 500 ? "Internal Server Error" : err?.message || "Error",
        requestId: id,
    };

    if (!isProd && err?.errors) payload.details = err.errors; // e.g., from http-errors
    if (!isProd && status >= 500 && err?.stack) payload.stack = err.stack;

    if (status >= 500) {
        log.error({err, status}, "💥 Server error");
    } else {
        log.warn({err, status}, "Handled error");
    }

    res.status(status).json(payload);
});

/* ------------------------------------
 * Start + Graceful shutdown
 * ------------------------------------ */
const server = app.listen(PORT, () => {
    logger.info(
        {
            port: PORT,
            sendMode: OTP_SEND_MODE,
            ttl: OTP_TTL,
            allowlist: ALLOWED_ORIGINS,
            nodeEnv: process.env.NODE_ENV,
            logLevel: LOG_LEVEL,
        },
        "✅ OTP API listening"
    );
});

function shutdown(signal: string) {
    logger.warn({signal}, "🛑 Shutting down...");
    server.close(async () => {
        try {
            await redis.quit();
        } catch (e) {
            logger.warn({err: e}, "Redis quit failed");
        }
        logger.info("👋 Bye.");
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: any) => {
    logger.error({err: reason}, "Unhandled promise rejection");
});
process.on("uncaughtException", (err) => {
    logger.error({err}, "Uncaught exception");
    if (process.env.NODE_ENV === "production") process.exit(1);
});
