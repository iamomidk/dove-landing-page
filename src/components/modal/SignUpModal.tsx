import {useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent} from "react";
import {type SignUpModalProps} from "../../types";
import {QuestionsDialog} from "./QuestionsDialog";
import TermsDialog from "./TermsDialog";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

const logEvent = (action: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};
/* ------------------------------- helpers ------------------------------- */

const IR_MOBILE = /^0?9\d{9}$/; // e.g., 09123456789

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function toPersianDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

function toWesternDigits(input: string): string {
    return input.replace(/[۰-۹]/g, (d) => westernDigits[persianDigits.indexOf(d)]);
}

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// --- API helpers ---
const API_BASE = "https://dove-backend.liara.run";
const SERVER_OTP_TTL = 180; // seconds (matches backend default)

async function postJSON<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    let data: any = null;
    try {
        data = await res.json();
    } catch {
        /* ignore */
    }
    if (!res.ok || (data && data.ok === false)) {
        const msg = data?.error || `خطا در ارتباط با سرور (${res.status})`;
        throw new Error(msg);
    }
    return data as T;
}

/** Convert local IR mobile like 0912... to E.164 +98912... (backend expects +?\d{8,15}) */
function toE164Iran(local: string): string {
    const w = toWesternDigits(local).replace(/\D/g, "");
    if (w.startsWith("+")) return w;
    if (w.startsWith("0")) return `+98${w.slice(1)}`;
    if (w.startsWith("98")) return `+${w}`;
    // last resort, assume Iranian number without leading 0
    return `+98${w}`;
}

/* ------------------------------ subcomponents ------------------------------ */

const ModalHeader: FC<{
    onBack: () => void;
    title: string;
    subtitle: string;
    titleId: string;
    subtitleId: string;
    canGoBack?: boolean;
}> = ({onBack, title, subtitle, titleId, subtitleId, canGoBack = true}) => (
    <>
        <div className="flex justify-end items-center mb-4">
            {canGoBack && (
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center">
                    بازگشت
                </button>
            )}
        </div>
        <h2 id={titleId} className="text-xl font-bold text-brand-blue flex-grow mb-6">
            {title}
        </h2>
        <p id={subtitleId} className="text-gray-500 text-sm mb-6">
            {subtitle}
        </p>
    </>
);

/* ------------------------------ component ------------------------------ */

const SignUpModal: FC<SignUpModalProps> = ({isOpen, onClose}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [showTerms, setShowTerms] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState(""); // stored as western digits "09..."
    const [otp, setOtp] = useState(""); // western digits

    const [timer, setTimer] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showQuestions, setShowQuestions] = useState(false);

    const modalVisible = isOpen && !showQuestions;

    const step1FirstInputRef = useRef<HTMLInputElement | null>(null);
    const step2FirstInputRef = useRef<HTMLInputElement | null>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            logEvent("signup_modal_opened");
        } else {
            logEvent("signup_modal_closed");
        }
    }, [isOpen]);

    // open/close lifecycle
    useEffect(() => {
        if (!isOpen) return;
        setStep(1);
        setTermsAccepted(false);
        setTimer(0);
        setOtp("");
        setErrorMsg(null);
        setShowQuestions(false);

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isOpen]);

    // focus per step
    useEffect(() => {
        if (!modalVisible) return;
        if (step === 1) step1FirstInputRef.current?.focus();
        else step2FirstInputRef.current?.focus();
    }, [modalVisible, step]);

    // countdown timer
    useEffect(() => {
        if (!modalVisible || step !== 2) return;
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [modalVisible, step]);

    // close on ESC
    useEffect(() => {
        if (!modalVisible) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [modalVisible, onClose]);

    useEffect(() => {
        if (showTerms) logEvent("terms_opened");
    }, [showTerms]);

    useEffect(() => {
        if (showQuestions) logEvent("questions_dialog_opened");
    }, [showQuestions]);

    /* ------------------------------ handlers ------------------------------ */

    // Send OTP via server
    const handleInfoSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!IR_MOBILE.test(phone) || !fullName) return;

        logEvent("signup_info_submitted", {full_name: fullName, phone});

        setSubmitting(true);
        setErrorMsg(null);
        try {
            const apiPhone = toE164Iran(phone);
            await postJSON<{ ok: true }>(`/api/otp/send`, {phone: apiPhone, fullName});
            logEvent("otp_sent", {phone});
            setStep(2);
            setTimer(SERVER_OTP_TTL);
        } catch (err: any) {
            logEvent("signup_error", {stage: "otp_send", message: err?.message});
            setErrorMsg(err?.message || "خطای ناشناخته");
        } finally {
            setSubmitting(false);
        }
    };

    // Verify OTP via server
    const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otp.length !== 4) return;

        logEvent("otp_submitted", {phone});

        setSubmitting(true);
        setErrorMsg(null);
        try {
            const apiPhone = toE164Iran(phone);
            await postJSON<{ ok: true; user?: { phone: string; full_name: string | null } }>(
                `/api/otp/verify`,
                {phone: apiPhone, code: otp}
            );
            logEvent("otp_verified_success", {phone});
            setShowQuestions(true);
        } catch (err: any) {
            logEvent("otp_verified_failed", {phone, message: err?.message});
            setErrorMsg(err?.message || "خطای ناشناخته");
        } finally {
            setSubmitting(false);
        }
    };

    // Persian-digit controlled inputs
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = toWesternDigits(e.target.value);
        setPhone(raw.replace(/\s+/g, ""));
    };
    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = toWesternDigits(e.target.value);
        setOtp(raw.replace(/\D/g, "").slice(0, 4));
    };

    // ⛔ don't render signup modal if not visible
    if (!modalVisible) {
        return (
            <>
                {/* Questions dialog (opens after successful OTP) */}
                {showQuestions && (
                    <QuestionsDialog
                        isOpen={showQuestions}
                        onClose={() => {
                            setShowQuestions(false);
                            onClose(); // finally close signup after finishing questions
                        }}
                    />
                )}
            </>
        );
    }

    const titleId = "signup-modal-title";
    const subtitleId = "signup-modal-subtitle";

    return (
        <>
            <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={subtitleId}
                onClick={onClose}
            >
                <div
                    className="bg-white shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto overflow-hidden flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    {step === 1 ? (
                        <div className="flex-1 px-6 py-6 md:px-10 md:py-8">
                            <ModalHeader
                                onBack={onClose}
                                title="مشخصات"
                                subtitle="لطفا شماره موبایل و نام و نام خانوادگی خود را وارد کنید."
                                titleId={titleId}
                                subtitleId={subtitleId}
                                canGoBack
                            />
                            <form onSubmit={handleInfoSubmit} noValidate>
                                <div className="mb-4">
                                    <input
                                        id="fullName"
                                        ref={step1FirstInputRef}
                                        type="text"
                                        placeholder="نام و نام خانوادگی"
                                        className="rtl-form-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="rtl-form-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        value={toPersianDigits(phone)}
                                        onChange={handlePhoneChange}
                                        pattern="0?9[0-9]{9}"
                                        maxLength={11}
                                        placeholder="شماره موبایل"
                                        required
                                        aria-invalid={phone !== "" && !IR_MOBILE.test(phone)}
                                        aria-describedby="phone-hint"
                                    />
                                    <p id="phone-hint" className="mt-1 text-xs md:text-sm text-gray-500">
                                        شماره با {toPersianDigits("09")} شروع می‌شود.
                                    </p>
                                </div>

                                <div className="flex items-center my-6">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="ml-2"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-xs md:text-sm text-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setShowTerms(true)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            قوانین و شرایط
                                        </button>
                                        {" "}
                                        را مطالعه کردم و با آن موافقم.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="brand-blue text-white font-bold py-3 md:py-4 w-full text-base md:text-lg transition-opacity disabled:opacity-50"
                                    disabled={submitting || !termsAccepted || !fullName || !IR_MOBILE.test(phone)}
                                >
                                    {submitting ? "در حال ارسال…" : "ارسال"}
                                </button>

                                {errorMsg &&
                                    <p className="mt-2 text-xs md:text-sm text-red-600 text-center">{errorMsg}</p>}
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 px-6 py-6 md:px-10 md:py-8">
                            <ModalHeader
                                onBack={() => setStep(1)}
                                title="تکمیل فرایند"
                                subtitle={`کد تایید برای ${toPersianDigits(phone)} ارسال شد.`}
                                titleId={titleId}
                                subtitleId={subtitleId}
                            />
                            <form onSubmit={handleOtpSubmit} noValidate>
                                <label htmlFor="otp" className="block text-sm md:text-base text-gray-700 mb-2">
                                    کد تایید
                                </label>
                                <input
                                    id="otp"
                                    ref={step2FirstInputRef}
                                    type="text"
                                    placeholder="••••"
                                    className="otp-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4 text-base md:text-lg"
                                    maxLength={4}
                                    value={toPersianDigits(otp)}
                                    onChange={handleOtpChange}
                                    required
                                    aria-invalid={otp !== "" && otp.length !== 4}
                                />

                                <button
                                    type="submit"
                                    className="brand-blue text-white font-bold py-3 md:py-4 w-full text-base md:text-lg"
                                    disabled={submitting || otp.length !== 4}
                                >
                                    {submitting ? "در حال بررسی…" : "نمایش سوالات"}
                                </button>

                                <div className="flex justify-between items-center my-4 gap-3">
                                    <p className="text-sm md:text-base text-gray-500" aria-live="polite">
                                        {toPersianDigits(formatTime(timer))}
                                    </p>
                                    <button
                                        type="button"
                                        className="text-xs md:text-sm text-blue-600 hover:underline disabled:opacity-50"
                                        onClick={() => handleInfoSubmit()}
                                        disabled={submitting || timer > 0}
                                    >
                                        ارسال مجدد کد
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs md:text-sm text-blue-600 hover:underline"
                                    >
                                        شماره موبایل اشتباه است؟
                                    </button>
                                </div>

                                {errorMsg &&
                                    <p className="mt-2 text-xs md:text-sm text-red-600 text-center">{errorMsg}</p>}
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Questions dialog (opens after successful OTP) */}
            {showQuestions && (
                <QuestionsDialog
                    isOpen={showQuestions}
                    onClose={() => {
                        setShowQuestions(false);
                        onClose(); // finally close signup after finishing questions
                    }}
                />
            )}
            {showTerms && (
                <TermsDialog
                    isOpen={showTerms}
                    onClose={() => setShowTerms(false)}
                    content={``}
                />
            )}
        </>
    );
};

export default SignUpModal;
