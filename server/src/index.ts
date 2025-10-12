import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import crypto from "crypto";
import { Pool, PoolClient } from "pg";
import { z } from "zod";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* ============================== logging ============================== */

type LogLevel = "debug" | "info" | "warn" | "error";
const LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";
const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function log(level: LogLevel, msg: string, meta: Record<string, unknown> = {}) {
    if (LEVEL_RANK[level] < LEVEL_RANK[LOG_LEVEL]) return;
    const line = { ts: new Date().toISOString(), level, msg, ...meta };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(line));
}

function maskPhone(phone: string) {
    const d = phone.replace(/\D/g, "");
    if (d.length <= 4) return "****";
    const tail = d.slice(-4);
    const prefix = phone.startsWith("+") ? "+" : "";
    return `${prefix}${d.slice(0, 2)}****${tail}`;
}
function maskCode(code: string) {
    return code ? "***" : "";
}

/* ============================== env ============================== */

const PORT = Number(process.env.PORT ?? 3000);
const NODE_ENV = process.env.NODE_ENV ?? "production";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS ?? 180);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS ?? 5);
const SEND_LIMIT_PER_PHONE = Number(process.env.SEND_LIMIT_PER_PHONE ?? 5);
const SEND_WINDOW_SECONDS = Number(process.env.SEND_WINDOW_SECONDS ?? 3600);
const SEND_LIMIT_PER_IP = Number(process.env.SEND_LIMIT_PER_IP ?? 30);
const SEND_IP_WINDOW_SECONDS = Number(process.env.SEND_IP_WINDOW_SECONDS ?? 3600);
const DEV_BYPASS_OTP = String(process.env.DEV_BYPASS_OTP ?? "false") === "true";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    log("error", "Missing env DATABASE_URL");
    throw new Error("DATABASE_URL is required");
}

const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION ?? "us-east-1";
const S3_BUCKET = process.env.S3_BUCKET;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_FORCE_PATH_STYLE = String(process.env.S3_FORCE_PATH_STYLE ?? "false") === "true";

const PUBLIC_VIDEO_BASE = process.env.PUBLIC_VIDEO_BASE;

const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY || "";
const KAVENEGAR_TEMPLATE = process.env.KAVENEGAR_TEMPLATE || "";
const KAVENEGAR_SENDER = process.env.KAVENEGAR_SENDER || "";

/* ============================== infra ============================== */

const pool = new Pool({ connectionString: DATABASE_URL });

const s3 = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    forcePathStyle: S3_FORCE_PATH_STYLE,
    credentials:
        S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
            ? { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY }
            : undefined,
});

/* ============================== app setup ============================== */

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// request id + timing
app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    const reqId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
    (req as any).reqId = reqId;
    res.setHeader("x-request-id", reqId);

    log("info", "req:start", {
        reqId,
        method: req.method,
        path: req.originalUrl || req.url,
        ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress,
        ua: req.headers["user-agent"],
    });

    const end = () => {
        const durMs = Number((process.hrtime.bigint() - start) / 1000000n);
        log("info", "req:end", {
            reqId,
            status: res.statusCode,
            bytesSent: (res as any)._contentLength || res.getHeader("content-length") || null,
            durMs,
        });
    };
    res.on("finish", end);
    res.on("close", end);
    next();
});

// CORS with safe local types + decision logs
type OriginCallback = (err: Error | null, allow?: boolean) => void;
const originFn = (requestOrigin: string | undefined, callback: OriginCallback) => {
    const normalized = requestOrigin?.replace(/\/$/, "");
    const allow = !requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin) || (normalized ? ALLOWED_ORIGINS.includes(normalized) : false);
    log("debug", "cors:decision", { origin: requestOrigin || null, allow });
    if (allow) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
};
app.use(
    cors({
        origin: originFn,
        credentials: false,
    })
);

/* ============================== helpers ============================== */

const phoneE164 = z.string().regex(/^\+?\d{8,15}$/);

function random4(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function withClient<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
    const c = await pool.connect();
    try {
        return await fn(c);
    } finally {
        c.release();
    }
}

/** rate limiting logs included */
async function checkRateLimits(client: PoolClient, phone: string, ip: string) {
    log("debug", "ratelimit:check:start", { phone: maskPhone(phone), ip });
    await client.query(`
    CREATE TABLE IF NOT EXISTS otp_send_log (
      id BIGINT,
      phone TEXT,
      ip TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    const q = `
    WITH windows AS (
      SELECT $1::int AS phone_win, $2::int AS ip_win
    )
    SELECT
      COUNT(*) FILTER (WHERE phone = $3 AND created_at >= NOW() - (SELECT phone_win * INTERVAL '1 second' FROM windows)) AS phone_cnt,
      COUNT(*) FILTER (WHERE ip = $4 AND created_at >= NOW() - (SELECT ip_win * INTERVAL '1 second' FROM windows)) AS ip_cnt
    FROM otp_send_log
  `;
    const { rows } = await client.query(q, [SEND_WINDOW_SECONDS, SEND_IP_WINDOW_SECONDS, phone, ip]);
    const row = rows[0] ?? { phone_cnt: 0, ip_cnt: 0 };
    log("debug", "ratelimit:check:counts", { phoneCnt: Number(row.phone_cnt), ipCnt: Number(row.ip_cnt) });
    if (Number(row.phone_cnt) >= SEND_LIMIT_PER_PHONE) throw new Error("تعداد درخواست بیش از حد برای این شماره");
    if (Number(row.ip_cnt) >= SEND_LIMIT_PER_IP) throw new Error("تعداد درخواست‌های شما بیش از حد مجاز است");
    log("debug", "ratelimit:check:ok");
}

/** Kavenegar utils & logs */
function e164ToKavenegarReceptor(e164: string): string {
    const digits = e164.replace(/\D/g, "");
    if (digits.startsWith("98")) return "0" + digits.slice(2);
    return digits;
}

async function sendOtpViaKavenegarVerifyLookup(e164Phone: string, code: string, reqId: string) {
    if (!KAVENEGAR_API_KEY || !KAVENEGAR_TEMPLATE) throw new Error("Kavenegar API key/template missing");
    const receptor = e164ToKavenegarReceptor(e164Phone);
    const body = new URLSearchParams({ receptor, token: code, template: KAVENEGAR_TEMPLATE });
    const url = `https://api.kavenegar.com/v1/${KAVENEGAR_API_KEY}/verify/lookup.json`;

    const t0 = Date.now();
    log("info", "kavenegar:verify:request", { reqId, receptor: maskPhone(receptor), code: maskCode(code) });
    const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    const t1 = Date.now();
    let data: any = {};
    try {
        data = await resp.json();
    } catch {}
    log("info", "kavenegar:verify:response", {
        reqId, status: resp.status, ok: resp.ok, durMs: t1 - t0, kStatus: data?.return?.status, kMessage: data?.return?.message,
    });
    if (!resp.ok || data?.return?.status !== 200) {
        throw new Error(data?.return?.message || "Kavenegar VerifyLookup failed");
    }
    return data;
}

async function sendOtpViaKavenegarSms(e164Phone: string, code: string, reqId: string) {
    if (!KAVENEGAR_API_KEY) throw new Error("Kavenegar API key missing");
    const receptor = e164ToKavenegarReceptor(e164Phone);
    const message = `کد تایید شما: ${code}`;
    const body = new URLSearchParams({ receptor, message });
    if (KAVENEGAR_SENDER) body.set("sender", KAVENEGAR_SENDER);
    const url = `https://api.kavenegar.com/v1/${KAVENEGAR_API_KEY}/sms/send.json`;

    const t0 = Date.now();
    log("info", "kavenegar:sms:request", { reqId, receptor: maskPhone(receptor), msgLen: message.length });
    const resp = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    const t1 = Date.now();
    let data: any = {};
    try {
        data = await resp.json();
    } catch {}
    log("info", "kavenegar:sms:response", {
        reqId, status: resp.status, ok: resp.ok, durMs: t1 - t0, kStatus: data?.return?.status, kMessage: data?.return?.message,
    });
    if (!resp.ok || data?.return?.status !== 200) {
        throw new Error(data?.return?.message || "Kavenegar SMS send failed");
    }
    return data;
}

/* ============================== bootstrap (final, robust) ============================== */

async function bootstrap() {
    const tag = "bootstrap";
    log("info", `${tag}:start:pk-migration-check`, {
        node: process.version,
        env: NODE_ENV,
        port: PORT,
        logLevel: LOG_LEVEL,
        corsOrigins: ALLOWED_ORIGINS,
    });

    await withClient(async (c) => {
        // Ensure base tables
        await c.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        phone TEXT PRIMARY KEY,
        full_name TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS otps (
        id BIGINT,
        phone TEXT,
        code TEXT,
        expires_at TIMESTAMPTZ,
        attempts INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS otp_send_log (
        id BIGINT,
        phone TEXT,
        ip TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

        // Ensure columns (idempotent)
        await c.query(`
      ALTER TABLE app_users
        ADD COLUMN IF NOT EXISTS full_name TEXT,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

      ALTER TABLE otps
        ADD COLUMN IF NOT EXISTS id BIGINT,
        ADD COLUMN IF NOT EXISTS phone TEXT,
        ADD COLUMN IF NOT EXISTS code TEXT,
        ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS attempts INT NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

      ALTER TABLE otp_send_log
        ADD COLUMN IF NOT EXISTS id BIGINT,
        ADD COLUMN IF NOT EXISTS phone TEXT,
        ADD COLUMN IF NOT EXISTS ip TEXT,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    `);

        // Detect PK on phone (robust) + PK name
        log("info", `${tag}:detect-otps-pk`);
        const { rows: pkPhoneRows } = await c.query<{ pk_on_phone: boolean; pk_name: string | null }>(`
      SELECT
        EXISTS (
          SELECT 1
          FROM pg_constraint pc
          JOIN LATERAL unnest(pc.conkey) AS k(attnum) ON TRUE
          JOIN pg_attribute a ON a.attrelid = pc.conrelid AND a.attnum = k.attnum
          WHERE pc.conrelid = 'otps'::regclass
            AND pc.contype = 'p'
            AND a.attname = 'phone'
        ) AS pk_on_phone,
        (
          SELECT conname
          FROM pg_constraint
          WHERE conrelid = 'otps'::regclass AND contype = 'p'
          LIMIT 1
        ) AS pk_name
    `);
        const pkOnPhone = !!pkPhoneRows[0]?.pk_on_phone;
        const pkName = pkPhoneRows[0]?.pk_name || null;
        log("info", `${tag}:otps-pk`, { pkOnPhone, pkName });

        // Ensure sequences & sync (is_called=true so nextval > max)
        log("info", `${tag}:sequences:sync`);
        await c.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'otps_id_seq') THEN
          CREATE SEQUENCE otps_id_seq;
          RAISE NOTICE 'created sequence otps_id_seq';
        END IF;
        PERFORM setval('otps_id_seq', COALESCE((SELECT MAX(id) FROM otps), 0), true);
        ALTER TABLE otps ALTER COLUMN id SET DEFAULT nextval('otps_id_seq');

        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'otp_send_log_id_seq') THEN
          CREATE SEQUENCE otp_send_log_id_seq;
          RAISE NOTICE 'created sequence otp_send_log_id_seq';
        END IF;
        PERFORM setval('otp_send_log_id_seq', COALESCE((SELECT MAX(id) FROM otp_send_log), 0), true);
        ALTER TABLE otp_send_log ALTER COLUMN id SET DEFAULT nextval('otp_send_log_id_seq');
      END
      $$;
    `);

        // Normalize IDs (dedupe & fill) before touching constraints
        log("info", `${tag}:dedupe/backfill-ids`);
        await c.query(`
      WITH d AS (
        SELECT ctid, id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY ctid) AS rn
        FROM otps WHERE id IS NOT NULL
      )
      UPDATE otps o
      SET id = nextval('otps_id_seq')
      FROM d
      WHERE o.ctid = d.ctid AND d.rn > 1;

      UPDATE otps SET id = nextval('otps_id_seq') WHERE id IS NULL;

      WITH d AS (
        SELECT ctid, id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY ctid) AS rn
        FROM otp_send_log WHERE id IS NOT NULL
      )
      UPDATE otp_send_log o
      SET id = nextval('otp_send_log_id_seq')
      FROM d
      WHERE o.ctid = d.ctid AND d.rn > 1;

      UPDATE otp_send_log SET id = nextval('otp_send_log_id_seq') WHERE id IS NULL;
    `);

        // If PK was on phone → migrate to id
        if (pkOnPhone && pkName) {
            log("warn", `${tag}:migrating-otps-pk-from-phone-to-id`, { pkName });
            await c.query(`ALTER TABLE otps DROP CONSTRAINT ${pkName};`);
            await c.query(`ALTER TABLE otps ADD PRIMARY KEY (id);`);
            log("info", `${tag}:otps-pk-now-id`);
        } else {
            // Ensure strong uniqueness on id either way
            log("info", `${tag}:ensure-otps-id-unique`);
            await c.query(`
        DO $$
        DECLARE pk_count INTEGER;
        BEGIN
          SELECT COUNT(*) INTO pk_count
          FROM pg_constraint
          WHERE conrelid = 'otps'::regclass AND contype = 'p';
          IF pk_count = 0 THEN
            ALTER TABLE otps ADD PRIMARY KEY (id);
          ELSE
            IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'otps_id_unique') THEN
              CREATE UNIQUE INDEX otps_id_unique ON otps(id);
            END IF;
          END IF;
        END$$;
      `);
        }

        // Helpful indexes (idempotent)
        await c.query(`CREATE INDEX IF NOT EXISTS otps_phone_idx ON otps(phone);`);
        await c.query(`CREATE INDEX IF NOT EXISTS otps_created_at_idx ON otps(created_at);`);
        await c.query(`CREATE INDEX IF NOT EXISTS otp_send_log_phone_idx ON otp_send_log(phone);`);
        await c.query(`CREATE INDEX IF NOT EXISTS otp_send_log_created_at_idx ON otp_send_log(created_at);`);

        log("info", `${tag}:done`);
    });
}

/* ============================== routes ============================== */

app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});

/** POST /api/otp/send { phone, fullName } */
app.post("/api/otp/send", async (req: Request, res: Response) => {
    const reqId = (req as any).reqId as string;
    try {
        const bodySchema = z.object({ phone: phoneE164, fullName: z.string().min(1).max(200) });
        const { phone, fullName } = bodySchema.parse(req.body);
        const ip =
            (typeof req.headers["x-forwarded-for"] === "string"
                ? req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
                : Array.isArray(req.headers["x-forwarded-for"])
                    ? req.headers["x-forwarded-for"][0]
                    : undefined) ||
            req.socket.remoteAddress ||
            "0.0.0.0";

        log("info", "otp:send:start", { reqId, phone: maskPhone(phone), ip });

        await withClient(async (c) => {
            await checkRateLimits(c, phone, ip);

            await c.query(
                `INSERT INTO app_users (phone, full_name)
         VALUES ($1, $2)
         ON CONFLICT (phone) DO UPDATE SET full_name = EXCLUDED.full_name`,
                [phone, fullName]
            );

            const code = DEV_BYPASS_OTP ? "1111" : random4();
            const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

            // ⬇️ explicit DEFAULT for id uses otps_id_seq (avoids legacy defaults)
            await c.query(
                `INSERT INTO otps (id, phone, code, expires_at, attempts, created_at)
         VALUES (DEFAULT, $1, $2, $3, 0, NOW())`,
                [phone, code, expiresAt]
            );

            await c.query(`INSERT INTO otp_send_log (id, phone, ip, created_at) VALUES (DEFAULT, $1, $2, NOW())`, [phone, ip]);

            if (DEV_BYPASS_OTP) {
                log("warn", "otp:send:dev-bypass", { reqId, phone: maskPhone(phone), code });
            } else {
                try {
                    await sendOtpViaKavenegarVerifyLookup(phone, code, reqId);
                } catch (e: any) {
                    log("warn", "kavenegar:verify:failed:falling-back-to-sms", { reqId, err: e?.message });
                    await sendOtpViaKavenegarSms(phone, code, reqId);
                }
            }
        });

        log("info", "otp:send:ok", { reqId, ttl: OTP_TTL_SECONDS });
        res.json({ ok: true /* ttl: OTP_TTL_SECONDS */ });
    } catch (err: any) {
        log("error", "otp:send:error", { reqId, err: err?.message });
        res.status(400).json({ ok: false, error: err?.message ?? "Bad Request" });
    }
});

/** POST /api/otp/verify { phone, code } */
app.post("/api/otp/verify", async (req: Request, res: Response) => {
    const reqId = (req as any).reqId as string;
    try {
        const bodySchema = z.object({ phone: phoneE164, code: z.string().regex(/^\d{4}$/) });
        const { phone, code } = bodySchema.parse(req.body);
        log("info", "otp:verify:start", { reqId, phone: maskPhone(phone), code: maskCode(code) });

        const result = await withClient(async (c) => {
            const { rows } = await c.query(
                `SELECT * FROM otps
         WHERE phone = $1
         ORDER BY created_at DESC
         LIMIT 1`,
                [phone]
            );
            const row = rows[0];
            if (!row) throw new Error("کدی برای این شماره یافت نشد");
            if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("کد منقضی شده است");
            if (Number(row.attempts) >= OTP_MAX_ATTEMPTS) throw new Error("تعداد تلاش‌ها بیش از حد مجاز است");

            if (row.code !== code && !DEV_BYPASS_OTP) {
                await c.query(`UPDATE otps SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
                throw new Error("کد وارد شده صحیح نیست");
            }

            await c.query(`DELETE FROM otps WHERE id = $1`, [row.id]);

            const u = await c.query(`SELECT phone, full_name FROM app_users WHERE phone = $1`, [phone]);
            return u.rows[0] ?? { phone, full_name: null as string | null };
        });

        log("info", "otp:verify:ok", { reqId, phone: maskPhone(phone) });
        res.json({ ok: true, user: result });
    } catch (err: any) {
        log("error", "otp:verify:error", { reqId, err: err?.message });
        res.status(400).json({ ok: false, error: err?.message ?? "Bad Request" });
    }
});

/** GET /api/video-url/signed/:key */
app.get("/api/video-url/signed/:key", async (req: Request, res: Response) => {
    const reqId = (req as any).reqId as string;
    try {
        if (!S3_BUCKET) throw new Error("S3_BUCKET is not configured");
        const key = decodeURIComponent(req.params.key);
        const expires = Math.min(Number(req.query.expires ?? 600), 3600);
        const disposition = String(req.query.disposition ?? "inline");
        const filename = String(req.query.filename ?? key.split("/").pop() ?? "file");

        log("info", "video:signed:start", { reqId, key, expires, disposition, filename });

        const command = new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            ResponseContentDisposition: `${disposition}; filename="${filename}"`,
        });

        const t0 = Date.now();
        const url = await getSignedUrl(s3, command, { expiresIn: expires });
        const durMs = Date.now() - t0;

        log("info", "video:signed:ok", { reqId, durMs });
        res.json({ ok: true, url });
    } catch (err: any) {
        log("error", "video:signed:error", { reqId, err: err?.message });
        res.status(400).json({ ok: false, error: err?.message ?? "Bad Request" });
    }
});

/** GET /api/video-url/static/:file */
app.get("/api/video-url/static/:file", async (req: Request, res: Response) => {
    const reqId = (req as any).reqId as string;
    try {
        if (!PUBLIC_VIDEO_BASE) throw new Error("PUBLIC_VIDEO_BASE is not set");
        const file = encodeURIComponent(req.params.file);
        const url = `${PUBLIC_VIDEO_BASE}/${file}`;
        log("info", "video:static:ok", { reqId, file });
        res.json({ ok: true, url });
    } catch (err: any) {
        log("error", "video:static:error", { reqId, err: err?.message });
        res.status(400).json({ ok: false, error: err?.message ?? "Bad Request" });
    }
});

/* ============================== errors & start ============================== */

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const reqId = (req as any).reqId as string;
    const msg = (err as Error)?.message || "Internal Server Error";
    const status = /CORS/i.test(msg) ? 403 : 500;
    log("error", "unhandled:error", { reqId, status, err: msg });
    res.status(status).json({ ok: false, error: msg, reqId });
});

const server = http.createServer(app);

bootstrap()
    .then(() => {
        server.listen(PORT, () => {
            log("info", "server:listening", { port: PORT, env: NODE_ENV, corsOrigins: ALLOWED_ORIGINS });
        });
    })
    .catch((err) => {
        log("error", "bootstrap:failed", { err: (err as Error)?.message });
        process.exit(1);
    });

process.on("unhandledRejection", (reason: any) => {
    log("error", "process:unhandledRejection", { err: reason?.message || String(reason) });
});
process.on("uncaughtException", (err) => {
    log("error", "process:uncaughtException", { err: err?.message });
});
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

async function shutdown(signal: string) {
    log("warn", "server:shutdown:start", { signal });
    server.close(async () => {
        try {
            await pool.end();
            log("warn", "server:shutdown:done");
            process.exit(0);
        } catch (e: any) {
            log("error", "server:shutdown:error", { err: e?.message });
            process.exit(1);
        }
    });
}
