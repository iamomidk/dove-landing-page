import { useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent } from "react";
import { type SignUpModalProps } from "../../types";
import { QuestionsDialog } from "./QuestionsDialog";

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

async function postJSON<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

/* ------------------------------ subcomponents ------------------------------ */

const ModalHeader: FC<{
    onBack: () => void;
    title: string;
    subtitle: string;
    titleId: string;
    subtitleId: string;
    canGoBack?: boolean;
}> = ({ onBack, title, subtitle, titleId, subtitleId, canGoBack = true }) => (
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

const SignUpModal: FC<SignUpModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState(""); // stored as western digits
    const [otp, setOtp] = useState(""); // stored as western digits

    const [timer, setTimer] = useState(0); // idle until server sends OTP
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showQuestions, setShowQuestions] = useState(false);

    // derived visibility: hide/dismiss signup while questions are open
    const modalVisible = isOpen && !showQuestions;

    const step1FirstInputRef = useRef<HTMLInputElement | null>(null);
    const step2FirstInputRef = useRef<HTMLInputElement | null>(null);
    // IMPORTANT: use number|null in browser (Vite/DOM) and window.clearInterval
    const intervalRef = useRef<number | null>(null);

    // open/close lifecycle — keep coupled to isOpen
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

    // focus per step — only when the signup modal is visible
    useEffect(() => {
        if (!modalVisible) return;
        if (step === 1) step1FirstInputRef.current?.focus();
        else step2FirstInputRef.current?.focus();
    }, [modalVisible, step]);

    // countdown timer — only tick while signup modal is visible AND on step 2
    useEffect(() => {
        if (!modalVisible || step !== 2) return;
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [modalVisible, step]);

    // close on ESC — only when signup modal is visible
    useEffect(() => {
        if (!modalVisible) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [modalVisible, onClose]);

    /* ------------------------------ handlers ------------------------------ */

    // Send OTP via server
    const handleInfoSubmit = (e?: FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (!IR_MOBILE.test(phone) || !fullName) return;

        setSubmitting(true);
        setErrorMsg(null);
        postJSON<{ ok: true; ttl: number }>("/api/otp/send", { phone, fullName })
            .then(({ ttl }) => {
                setStep(2);
                setTimer(Number.isFinite(ttl) ? ttl : 120); // start from server TTL
            })
            .catch((err: Error) => {
                setErrorMsg(err.message);
            })
            .finally(() => setSubmitting(false));
    };

    // Verify OTP via server
    const handleOtpSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otp.length !== 4) return;

        setSubmitting(true);
        setErrorMsg(null);
        postJSON<{ ok: true }>("/api/otp/verify", { phone, code: otp })
            .then(() => {
                // ✅ open Questions and implicitly dismiss/hide the signup modal
                setShowQuestions(true);
            })
            .catch((err: Error) => {
                setErrorMsg(err.message);
            })
            .finally(() => setSubmitting(false));
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
                        onSubmit={(answers) => {
                            // integrate with backend later
                            console.log("answers:", answers);
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
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={subtitleId}
                onClick={onClose}
            >
                <div className="bg-white shadow-2xl w-full max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
                    {step === 1 ? (
                        <div className="p-6">
                            <ModalHeader
                                onBack={onClose}
                                title="آشنایی"
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
                                        className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                        value={fullName}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                        value={toPersianDigits(phone)}
                                        onChange={handlePhoneChange}
                                        pattern="0?9[0-9]{9}"
                                        maxLength={11}
                                        placeholder="شماره موبایل"
                                        required
                                        aria-invalid={phone !== "" && !IR_MOBILE.test(phone)}
                                        aria-describedby="phone-hint"
                                    />
                                    <p id="phone-hint" className="mt-1 text-xs text-gray-500">
                                        شماره با {toPersianDigits("09")} شروع می‌شود.
                                    </p>
                                </div>

                                <div className="flex items-center my-6">
                                    {/* No ticking timer on step 1 */}
                                    <p className="text-sm text-gray-500 ml-auto" aria-live="polite">
                                        —
                                    </p>
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={termsAccepted}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTermsAccepted(e.target.checked)}
                                        className="ml-2"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-700">
                                        <a href="/" className="text-blue-600 hover:underline">
                                            قوانین و شرایط
                                        </a>{" "}
                                        را مطالعه کردم و با آن موافقم.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="brand-blue text-white font-bold py-3  w-full transition-opacity disabled:opacity-50"
                                    disabled={submitting || !termsAccepted || !fullName || !IR_MOBILE.test(phone)}
                                >
                                    {submitting ? "در حال ارسال…" : "ارسال"}
                                </button>

                                {errorMsg && <p className="mt-2 text-xs text-red-600 text-center">{errorMsg}</p>}
                            </form>
                        </div>
                    ) : (
                        <div className="p-6">
                            <ModalHeader
                                onBack={() => setStep(1)}
                                title="تثبیت"
                                subtitle={`کد تایید برای ${toPersianDigits(phone)} ارسال شد.`}
                                titleId={titleId}
                                subtitleId={subtitleId}
                            />
                            <form onSubmit={handleOtpSubmit} noValidate>
                                <label htmlFor="otp" className="block text-sm text-gray-700 mb-1">
                                    کد تایید
                                </label>
                                <input
                                    id="otp"
                                    ref={step2FirstInputRef}
                                    type="text"
                                    placeholder="••••"
                                    className="otp-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                    maxLength={4}
                                    value={toPersianDigits(otp)}
                                    onChange={handleOtpChange}
                                    required
                                    aria-invalid={otp !== "" && otp.length !== 4}
                                />

                                <button
                                    type="submit"
                                    className="brand-blue text-white font-bold py-3  w-full"
                                    disabled={submitting || otp.length !== 4}
                                >
                                    {submitting ? "در حال بررسی…" : "نمایش سوالات"}
                                </button>

                                <div className="flex justify-between items-center my-4 gap-3">
                                    <p className="text-sm text-gray-500" aria-live="polite">
                                        {toPersianDigits(formatTime(timer))}
                                    </p>
                                    <button
                                        type="button"
                                        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                                        onClick={() => handleInfoSubmit()}
                                        disabled={submitting || timer > 0}
                                        aria-disabled={submitting || timer > 0}
                                    >
                                        ارسال مجدد کد
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        شماره موبایل اشتباه است؟
                                    </button>
                                </div>

                                {errorMsg && <p className="mt-2 text-xs text-red-600 text-center">{errorMsg}</p>}
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
                    onSubmit={(answers) => {
                        console.log("answers:", answers);
                    }}
                />
            )}
        </>
    );
};

export default SignUpModal;
