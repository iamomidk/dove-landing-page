import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Kavenegar = require('kavenegar');
import { z } from 'zod';
import Redis from 'ioredis';

// --- Config ---
const PORT = Number(process.env.PORT || 4000);
const OTP_TTL = Number(process.env.OTP_TTL_SECONDS ?? 300);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS ?? 5);

const SEND_LIMIT_PER_PHONE = Number(process.env.SEND_LIMIT_PER_PHONE ?? 3);
const SEND_WINDOW_SECONDS = Number(process.env.SEND_WINDOW_SECONDS ?? 600);
const SEND_LIMIT_PER_IP = Number(process.env.SEND_LIMIT_PER_IP ?? 10);
const SEND_IP_WINDOW_SECONDS = Number(process.env.SEND_IP_WINDOW_SECONDS ?? 600);
const VERIFY_LIMIT_PER_IP = Number(process.env.VERIFY_LIMIT_PER_IP ?? 30);
const VERIFY_IP_WINDOW_SECONDS = Number(process.env.VERIFY_IP_WINDOW_SECONDS ?? 600);

const IR_MOBILE = /^0?9\d{9}$/;

// --- Express ---
const app = express();
app.use(cors({ origin: true, credentials: false })); // allow from frontend origin; tighten in prod
app.use(express.json());

// --- Redis ---
const redis = new Redis(process.env.REDIS_URL!);

// --- Kavenegar ---
const api = Kavenegar.KavenegarApi({ apikey: process.env.KAVENEGAR_API_KEY! });

// --- Helpers ---
const phoneSchema = z.object({ phone: z.string().regex(IR_MOBILE) });
const sendSchema = phoneSchema.extend({ fullName: z.string().min(2) });
const verifySchema = phoneSchema.extend({ code: z.string().length(4).regex(/^\d{4}$/) });

const normPhone = (p: string) => (p.startsWith('0') ? p : `0${p}`);
const genCode = () => String(Math.floor(1000 + Math.random() * 9000));
const ip = (req: express.Request) =>
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '0.0.0.0';

async function rateLimitHit(key: string, limit: number, windowSec: number) {
    const script = `
    local c = redis.call("INCR", KEYS[1])
    if c == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
    return c
  `;
    // @ts-ignore
    const count = await redis.eval(script, 1, key, windowSec);
    return Number(count) > limit;
}

// Redis keys
const kOtp = (p: string) => `otp:${p}:code`;
const kExp = (p: string) => `otp:${p}:exp`;
const kAtt = (p: string) => `otp:${p}:attempts`;
const kSendPhone = (p: string) => `rl:send:phone:${p}`;
const kSendIp = (addr: string) => `rl:send:ip:${addr}`;
const kVerifyIp = (addr: string) => `rl:verify:ip:${addr}`;

// --- Routes ---

// Health check (for Docker/NGINX)
app.get('/health', (_req, res) => res.status(200).send('ok'));

// Send OTP
app.post('/api/otp/send', async (req, res) => {
    const parsed = sendSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: 'Bad payload' });

    const rawPhone = parsed.data.phone;
    const phone = normPhone(rawPhone);
    const clientIp = ip(req);

    // Rate limits
    if (await rateLimitHit(kSendPhone(phone), SEND_LIMIT_PER_PHONE, SEND_WINDOW_SECONDS)) {
        return res.status(429).json({ ok: false, error: 'ارسال بیش از حد، لطفا بعدا تلاش کنید.' });
    }
    if (await rateLimitHit(kSendIp(clientIp), SEND_LIMIT_PER_IP, SEND_IP_WINDOW_SECONDS)) {
        return res.status(429).json({ ok: false, error: 'تعداد درخواست زیاد از IP، لطفا بعدا تلاش کنید.' });
    }

    // Generate + store code
    const code = genCode();
    const expiresAt = Date.now() + OTP_TTL * 1000;
    await Promise.all([
        redis.set(kOtp(phone), code, 'EX', OTP_TTL),
        redis.set(kExp(phone), String(expiresAt), 'EX', OTP_TTL),
        redis.del(kAtt(phone)),
    ]);

    // Send via Kavenegar VerifyLookup
    api.VerifyLookup(
        {
            receptor: phone,
            token: code,
            template: process.env.KAVENEGAR_VERIFY_TEMPLATE || 'registerverify',
        },
        (_response: unknown, status: number) => {
            if (status >= 200 && status < 300) {
                return res.json({ ok: true, ttl: OTP_TTL });
            }
            return res.status(502).json({ ok: false, error: 'مشکل در ارسال پیامک' });
        }
    );
});

// Verify OTP
app.post('/api/otp/verify', async (req, res) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: 'Bad payload' });

    const phone = normPhone(parsed.data.phone);
    const codeAttempt = parsed.data.code;
    const clientIp = ip(req);

    // Rate limit verify attempts by IP
    if (await rateLimitHit(kVerifyIp(clientIp), VERIFY_LIMIT_PER_IP, VERIFY_IP_WINDOW_SECONDS)) {
        return res.status(429).json({ ok: false, error: 'تلاش‌های زیاد، لطفا بعدا تلاش کنید.' });
    }

    const [code, expStr] = await redis.mget(kOtp(phone), kExp(phone));
    if (!code || !expStr) return res.status(400).json({ ok: false, error: 'کد منقضی شده یا ارسال نشده است' });

    if (Date.now() > Number(expStr)) {
        await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
        return res.status(400).json({ ok: false, error: 'کد منقضی شده است' });
    }

    const attempts = Number((await redis.get(kAtt(phone))) || 0);
    if (attempts >= OTP_MAX_ATTEMPTS) {
        await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
        return res.status(429).json({ ok: false, error: 'تلاش‌های بیش از حد' });
    }

    if (codeAttempt !== code) {
        await redis.incr(kAtt(phone));
        await redis.expire(kAtt(phone), Math.max(30, Math.min(OTP_TTL, 300)));
        return res.status(400).json({ ok: false, error: 'کد وارد شده نادرست است' });
    }

    // Success
    await redis.del(kOtp(phone), kExp(phone), kAtt(phone));
    return res.json({ ok: true });
});

// --- Start server ---
app.listen(PORT, () => {
    console.log(`✅ OTP API listening on http://localhost:${PORT}`);
});
