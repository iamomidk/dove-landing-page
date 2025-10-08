import "dotenv/config";
import {z} from "zod";

const raw = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    OTP_TTL_SECONDS: process.env.OTP_TTL_SECONDS,
    OTP_MAX_ATTEMPTS: process.env.OTP_MAX_ATTEMPTS,
    SEND_LIMIT_PER_PHONE: process.env.SEND_LIMIT_PER_PHONE,
    SEND_WINDOW_SECONDS: process.env.SEND_WINDOW_SECONDS,
    SEND_LIMIT_PER_IP: process.env.SEND_LIMIT_PER_IP,
    SEND_IP_WINDOW_SECONDS: process.env.SEND_IP_WINDOW_SECONDS,
    VERIFY_LIMIT_PER_IP: process.env.VERIFY_LIMIT_PER_IP,
    VERIFY_IP_WINDOW_SECONDS: process.env.VERIFY_IP_WINDOW_SECONDS,
    OTP_SEND_MODE: process.env.OTP_SEND_MODE,
    KAVENEGAR_API_KEY: process.env.KAVENEGAR_API_KEY,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    ALLOW_WILDCARD: process.env.ALLOW_WILDCARD,
    REDIS_URL: process.env.REDIS_URL,
    LIARA_ENDPOINT: process.env.LIARA_ENDPOINT,
    LIARA_BUCKET_NAME: process.env.LIARA_BUCKET_NAME,
    LIARA_ACCESS_KEY: process.env.LIARA_ACCESS_KEY,
    LIARA_SECRET_KEY: process.env.LIARA_SECRET_KEY,
    LIARA_REGION: process.env.LIARA_REGION
};

const schema = z.object({
    PORT: z.preprocess((v) => Number(v || 4000), z.number().int().positive()),
    NODE_ENV: z.string().optional(),
    OTP_TTL_SECONDS: z.preprocess((v) => Number(v || 300), z.number().int().positive()),
    OTP_MAX_ATTEMPTS: z.preprocess((v) => Number(v || 5), z.number().int().positive()),
    SEND_LIMIT_PER_PHONE: z.preprocess((v) => Number(v || 3), z.number().int().nonnegative()),
    SEND_WINDOW_SECONDS: z.preprocess((v) => Number(v || 600), z.number().int().nonnegative()),
    SEND_LIMIT_PER_IP: z.preprocess((v) => Number(v || 10), z.number().int().nonnegative()),
    SEND_IP_WINDOW_SECONDS: z.preprocess((v) => Number(v || 600), z.number().int().nonnegative()),
    VERIFY_LIMIT_PER_IP: z.preprocess((v) => Number(v || 30), z.number().int().nonnegative()),
    VERIFY_IP_WINDOW_SECONDS: z.preprocess((v) => Number(v || 600), z.number().int().nonnegative()),
    OTP_SEND_MODE: z.string().optional(),
    KAVENEGAR_API_KEY: z.string().optional(),
    ALLOWED_ORIGINS: z.string().optional(),
    ALLOW_WILDCARD: z.string().optional(),
    REDIS_URL: z.string().optional(),
    LIARA_ENDPOINT: z.string().optional(),
    LIARA_BUCKET_NAME: z.string().optional(),
    LIARA_ACCESS_KEY: z.string().optional(),
    LIARA_SECRET_KEY: z.string().optional(),
    LIARA_REGION: z.string().optional()
});

const parsed = schema.parse(raw);

export default {
    PORT: parsed.PORT,
    NODE_ENV: parsed.NODE_ENV,
    OTP_TTL_SECONDS: parsed.OTP_TTL_SECONDS,
    OTP_MAX_ATTEMPTS: parsed.OTP_MAX_ATTEMPTS,
    SEND_LIMIT_PER_PHONE: parsed.SEND_LIMIT_PER_PHONE,
    SEND_WINDOW_SECONDS: parsed.SEND_WINDOW_SECONDS,
    SEND_LIMIT_PER_IP: parsed.SEND_LIMIT_PER_IP,
    SEND_IP_WINDOW_SECONDS: parsed.SEND_IP_WINDOW_SECONDS,
    VERIFY_LIMIT_PER_IP: parsed.VERIFY_LIMIT_PER_IP,
    VERIFY_IP_WINDOW_SECONDS: parsed.VERIFY_IP_WINDOW_SECONDS,
    OTP_SEND_MODE: (parsed.OTP_SEND_MODE || "kavenegar").toLowerCase(),
    KAVENEGAR_API_KEY: parsed.KAVENEGAR_API_KEY,
    ALLOWED_ORIGINS: parsed.ALLOWED_ORIGINS || "",
    ALLOW_WILDCARD: (parsed.ALLOW_WILDCARD || "true").toLowerCase() === "true",
    REDIS_URL: parsed.REDIS_URL || "redis://127.0.0.1:6379",
    LIARA_ENDPOINT: parsed.LIARA_ENDPOINT || "",
    LIARA_BUCKET_NAME: parsed.LIARA_BUCKET_NAME || "",
    LIARA_ACCESS_KEY: parsed.LIARA_ACCESS_KEY || "",
    LIARA_SECRET_KEY: parsed.LIARA_SECRET_KEY || "",
    LIARA_REGION: parsed.LIARA_REGION || "default"
} as const;