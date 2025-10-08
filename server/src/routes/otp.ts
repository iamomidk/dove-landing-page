import {Router} from "express";
import {
    genCode,
    normPhone,
    sendSchema,
    verifySchema
} from "../utils/validators";
import {redis} from "../infra/redis";
import createHttpError from "http-errors";
import {rateLimitHit} from "../utils/rateLimiter";
import env from "../config/env";
import {sendSms} from "../services/sms";

const router = Router();

const kOtp = (p: string) => `otp:${p}:code`;
const kExp = (p: string) => `otp:${p}:exp`;
const kAtt = (p: string) => `otp:${p}:attempts`;
const kSendPhone = (p: string) => `rl:send:phone:${p}`;
const kSendIp = (addr: string) => `rl:send:ip:${addr}`;
const kVerifyIp = (addr: string) => `rl:verify:ip:${addr}`;

function clientIp(req: any) {
    return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "0.0.0.0";
}

/* Send OTP */
router.post("/api/otp/send", async (req, res, next) => {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return next(createHttpError(400, "Bad payload", {errors: parsed.error.flatten()}));

    const phone = normPhone(parsed.data.phone);
    const fullName = parsed.data.fullName;
    const ip = clientIp(req);

    try {
        if (await rateLimitHit(kSendPhone(phone), env.SEND_LIMIT_PER_PHONE, env.SEND_WINDOW_SECONDS)) {
            throw createHttpError(429, "ارسال بیش از حد، لطفا بعدا تلاش کنید.");
        }
        if (await rateLimitHit(kSendIp(ip), env.SEND_LIMIT_PER_IP, env.SEND_IP_WINDOW_SECONDS)) {
            throw createHttpError(429, "تعداد درخواست زیاد از IP، لطفا بعدا تلاش کنید.");
        }

        const code = genCode();
        const expiresAt = Date.now() + env.OTP_TTL_SECONDS * 1000;

        await Promise.all([
            redis.set(kOtp(phone), code, "EX", env.OTP_TTL_SECONDS),
            redis.set(kExp(phone), String(expiresAt), "EX", env.OTP_TTL_SECONDS),
            redis.del(kAtt(phone))
        ]);

        try {
            await sendSms({receptor: phone, token: code, template: process.env.OTP_TEMPLATE_NAME || "dove-otp"});
        } catch (e) {
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            return next(createHttpError(502, "مشکل در ارسال پیامک" + e.toString()));
        }

        res.json({ok: true, ttl: env.OTP_TTL_SECONDS});
    } catch (err) {
        next(err);
    }
});

/* Verify OTP */
router.post("/api/otp/verify", async (req, res, next) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) return next(createHttpError(400, "Bad payload", {errors: parsed.error.flatten()}));

    const phone = normPhone(parsed.data.phone);
    const codeAttempt = parsed.data.code;
    const ip = clientIp(req);

    try {
        if (await rateLimitHit(kVerifyIp(ip), env.VERIFY_LIMIT_PER_IP, env.VERIFY_IP_WINDOW_SECONDS)) {
            throw createHttpError(429, "تلاش‌های زیاد، لطفا بعدا تلاش کنید.");
        }

        const [code, expStr] = await redis.mget(kOtp(phone), kExp(phone));
        if (!code || !expStr) {
            throw createHttpError(400, "کد منقضی شده یا ارسال نشده است");
        }

        if (Date.now() > Number(expStr)) {
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            throw createHttpError(400, "کد منقضی شده است");
        }

        const attempts = Number((await redis.get(kAtt(phone))) || 0);
        if (attempts >= env.OTP_MAX_ATTEMPTS) {
            await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
            throw createHttpError(429, "تلاش‌های بیش از حد");
        }

        if (codeAttempt !== code) {
            await redis.incr(kAtt(phone));
            await redis.expire(kAtt(phone), Math.max(30, Math.min(env.OTP_TTL_SECONDS, 300)));
            throw createHttpError(400, "کد وارد شده نادرست است");
        }

        await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
        res.json({ok: true});
    } catch (err) {
        next(err);
    }
});

export default router;