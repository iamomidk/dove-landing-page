import cors from "cors";
import env from "../config/env";
import {logger} from "../config/logger";

/* ---------- CORS helpers from original file (normalized) ---------- */
function normalizeOrigin(o?: string | null) {
    if (!o) return "";
    try {
        const url = new URL(o);
        url.pathname = "";
        return url.origin.toLowerCase();
    } catch {
        return o.trim().replace(/\/+$/, "").toLowerCase();
    }
}

const rawAllowlist = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);

const expandedAllowlist = Array.from(
    new Set(
        rawAllowlist.flatMap((origin) => {
            if (origin.startsWith("*.")) return [origin.toLowerCase()];
            const n = normalizeOrigin(origin);
            if (n.startsWith("http://")) return [n, n.replace("http://", "https://")];
            if (n.startsWith("https://")) return [n, n.replace("https://", "http://")];
            return ["http://" + n, "https://" + n];
        })
    )
);

function isAllowedOrigin(origin?: string | null) {
    if (!origin) return true;
    const clean = normalizeOrigin(origin);
    if (expandedAllowlist.includes(clean)) return true;
    if (env.ALLOW_WILDCARD) {
        for (const entry of expandedAllowlist) {
            if (entry.startsWith("*.")) {
                try {
                    const host = new URL(clean).hostname;
                    const domain = entry.slice(2);
                    if (host === domain || host.endsWith("." + domain)) return true;
                } catch { /* empty */ }
            }
        }
        try {
            const host = new URL(clean).hostname;
            if (host.endsWith(".liara.run")) return true;
        } catch { /* empty */ }
    }
    return false;
}

export const corsMiddleware = cors({
    origin(origin, callback) {
        const log = logger.child({scope: "cors"});
        const clean = normalizeOrigin(origin);
        log.debug({origin, clean, allowlist: expandedAllowlist}, "CORS check");

        if (isAllowedOrigin(origin)) return callback(null, true);
        log.warn({origin, clean}, "CORS rejected");
        const err = Object.assign(new Error(`CORS: Origin ${origin} not allowed`), {status: 403});
        callback(err as any);
    },
    methods: ["GET", "HEAD", "OPTIONS", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: false,
    maxAge: 86400
});