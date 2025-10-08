// src/services/sms.ts
import Kavenegar from "kavenegar";
import pino from "pino";

const logger = pino();

const OTP_SEND_MODE = (process.env.OTP_SEND_MODE || "kavenegar").toLowerCase();
const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY || "";

const kavenegar =
    OTP_SEND_MODE === "kavenegar" && KAVENEGAR_API_KEY
        ? Kavenegar.KavenegarApi({apikey: KAVENEGAR_API_KEY})
        : null;

type SmsParams = {
    receptor: string;
    token: string;
    template: string;
};

export async function sendSms({receptor, token, template}: SmsParams) {
    const log = logger.child({scope: "sms", receptor, template});

    if (OTP_SEND_MODE === "mock") {
        log.info({token}, "🔔 [MOCK SMS]");
        return;
    }

    if (OTP_SEND_MODE === "log") {
        log.info({token}, "🔔 [LOG SMS] (no external call)");
        return;
    }

    if (!kavenegar) {
        const err = new Error("SMS provider not configured");
        log.error({err}, "SMS send failed - provider missing");
        throw err;
    }

    try {
        const start = Date.now();
        const {resp, status} = await new Promise<any>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error("Kavenegar timeout")), 10000);

            kavenegar.VerifyLookup({receptor, token, template}, (resp: any, status: number) => {
                clearTimeout(timer);
                resolve({resp, status});
            });
        });

        const kStatus = Number(resp?.return?.status);
        const kMessage = resp?.return?.message;
        const messageId = resp?.return?.messageid;

        // ✅ Accept all valid success statuses
        const validStatuses = [200, 5, 6, 7, 8];
        if (status >= 200 && status < 300 && validStatuses.includes(kStatus)) {
            log.info({status, kStatus, kMessage, messageId, ms: Date.now() - start}, "SMS sent successfully");
            return;
        }

        const err: any = new Error("sms send failed");
        Object.assign(err, {status, kStatus, kMessage, messageId, resp});
        log.error({err}, "SMS send failed");
        throw new Error("مشکل در ارسال پیامک");
    } catch (error) {
        log.error({err: error}, "SMS send error");
        throw new Error("مشکل در ارسال پیامک");
    }
}