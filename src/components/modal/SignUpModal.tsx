import { useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent } from "react";
import { type SignUpModalProps } from "../../types";

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
            <h2 id={titleId} className="text-xl font-bold text-brand-blue text-center flex-grow">
                {title}
            </h2>
            {canGoBack && (
                <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center">
                    بازگشت
                </button>
            )}
        </div>
        <p id={subtitleId} className="text-gray-500 text-sm text-center mb-6">
            {subtitle}
        </p>
    </>
);

const IR_MOBILE = /^0?9\d{9}$/; // Iran mobile pattern (e.g., 09123456789)

const SignUpModal: FC<SignUpModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [timer, setTimer] = useState(115);

    // ✅ fixed typing: ReturnType<typeof setInterval>
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    // ✅ refs with nullable types + optional chaining when focusing
    const step1FirstInputRef = useRef<HTMLInputElement | null>(null);
    const step2FirstInputRef = useRef<HTMLInputElement | null>(null);

    // lifecycle: reset state when modal opens / cleanup on close
    useEffect(() => {
        if (!isOpen) return;
        setStep(1);
        setTermsAccepted(false);
        setTimer(115);
        setOtp("");

        // lock background scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            if (intervalRef.current !== undefined) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        };
    }, [isOpen]);

    // focus management — safe with optional chaining
    useEffect(() => {
        if (!isOpen) return;
        if (step === 1) {
            step1FirstInputRef.current?.focus();
        } else if (step === 2) {
            step2FirstInputRef.current?.focus();
        }
    }, [isOpen, step]);

    // countdown timer — cleared/restarted safely with correct typing
    useEffect(() => {
        if (!isOpen) return;
        if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = window.setInterval(() => {
            setTimer((t) => (t > 0 ? t - 1 : 0));
        }, 1000);

        return () => {
            if (intervalRef.current !== undefined) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        };
    }, [isOpen, step]);

    // close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    const handleInfoSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!IR_MOBILE.test(phone)) return;
        setStep(2);
    };

    const handleOtpSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (otp.trim().length !== 4) return;
        // TODO: real verification flow
        onClose();
    };

    if (!isOpen) return null;

    const titleId = "signup-modal-title";
    const subtitleId = "signup-modal-subtitle";

    return (
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
                            title="تثبیت"
                            subtitle="لطفا شماره موبایل و نام و نام خانوادگی خود را وارد کنید."
                            titleId={titleId}
                            subtitleId={subtitleId}
                            canGoBack
                        />
                        <form onSubmit={handleInfoSubmit} noValidate>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm text-gray-700 mb-1">
                                    نام و نام خانوادگی
                                </label>
                                <input
                                    id="fullName"
                                    ref={step1FirstInputRef}
                                    type="text"
                                    inputMode="text"
                                    autoComplete="name"
                                    placeholder="مثال: علی رضایی"
                                    className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                    value={fullName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
                                    شماره موبایل
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                                    className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                    value={phone}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\s+/g, ""))}
                                    pattern="0?9[0-9]{9}"
                                    required
                                    aria-invalid={phone !== "" && !IR_MOBILE.test(phone)}
                                    aria-describedby="phone-hint"
                                />
                                <p id="phone-hint" className="mt-1 text-xs text-gray-500">
                                    شماره با ۰۹ شروع می‌شود.
                                </p>
                            </div>

                            <div className="flex items-center my-6">
                                <p className="text-sm text-gray-500 ml-auto" aria-live="polite">
                                    {formatTime(timer)}
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
                                className="brand-blue text-white font-bold py-3 rounded-lg w-full transition-opacity disabled:opacity-50"
                                disabled={!termsAccepted || !fullName || !IR_MOBILE.test(phone)}
                            >
                                ارسال
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <ModalHeader
                            onBack={() => setStep(1)}
                            title="کد تایید"
                            subtitle={`لطفا کد ۴ رقمی ارسال شده به شماره ${phone || "—"} را وارد نمایید!`}
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
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="••••"
                                className="otp-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                maxLength={4}
                                value={otp}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                required
                                aria-invalid={otp !== "" && otp.length !== 4}
                            />

                            <div className="flex justify-between items-center my-6">
                                <p className="text-sm text-gray-500" aria-live="polite">
                                    {formatTime(timer)}
                                </p>
                                <a
                                    href="/"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setStep(1);
                                    }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    شماره موبایل اشتباه است؟
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="brand-blue text-white font-bold py-3 rounded-lg w-full"
                                disabled={otp.length !== 4}
                            >
                                نمایش سوالات
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpModal;
