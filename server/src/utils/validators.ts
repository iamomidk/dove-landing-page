import {z, ZodError} from "zod";

export const IR_MOBILE = /^0?9\d{9}$/;

export const phoneSchema = z.object({phone: z.string().regex(IR_MOBILE)});
export const sendSchema = phoneSchema.extend({fullName: z.string().min(2)});
export const verifySchema = phoneSchema.extend({code: z.string().length(4).regex(/^\d{4}$/)});
export const videoQuerySchema = z.object({key: z.string().min(1).refine((v) => !v.includes(".."), "invalid key")});

export function normPhone(p: string) {
    return p.startsWith("0") ? p : `0${p}`;
}

export const genCode = () => String(Math.floor(1000 + Math.random() * 9000));

export { z, ZodError };