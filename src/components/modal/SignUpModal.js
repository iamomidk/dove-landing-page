import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import {} from "../../types";
import { QuestionsDialog } from "./QuestionsDialog";
import TermsDialog from "./TermsDialog";
const logEvent = (action, params) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};
/* ------------------------------- helpers ------------------------------- */
const IR_MOBILE = /^0?9\d{9}$/; // e.g., 09123456789
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
function toPersianDigits(input) {
    return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}
function toWesternDigits(input) {
    return input.replace(/[۰-۹]/g, (d) => westernDigits[persianDigits.indexOf(d)]);
}
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
// --- API helpers ---
const API_BASE = "https://dove-backend.liara.run";
const SERVER_OTP_TTL = 180; // seconds (matches backend default)
async function postJSON(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    let data = null;
    try {
        data = await res.json();
    }
    catch {
        /* ignore */
    }
    if (!res.ok || (data && data.ok === false)) {
        const msg = data?.error || `خطا در ارتباط با سرور (${res.status})`;
        throw new Error(msg);
    }
    return data;
}
/** Convert local IR mobile like 0912... to E.164 +98912... (backend expects +?\d{8,15}) */
function toE164Iran(local) {
    const w = toWesternDigits(local).replace(/\D/g, "");
    if (w.startsWith("+"))
        return w;
    if (w.startsWith("0"))
        return `+98${w.slice(1)}`;
    if (w.startsWith("98"))
        return `+${w}`;
    // last resort, assume Iranian number without leading 0
    return `+98${w}`;
}
/* ------------------------------ subcomponents ------------------------------ */
const ModalHeader = ({ onBack, title, subtitle, titleId, subtitleId, canGoBack = true }) => (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-end items-center mb-4", children: canGoBack && (_jsx("button", { onClick: onBack, className: "text-sm text-gray-500 hover:text-gray-800 flex items-center", children: "\u0628\u0627\u0632\u06AF\u0634\u062A" })) }), _jsx("h2", { id: titleId, className: "text-xl font-bold text-brand-blue flex-grow mb-6", children: title }), _jsx("p", { id: subtitleId, className: "text-gray-500 text-sm mb-6", children: subtitle })] }));
/* ------------------------------ component ------------------------------ */
const SignUpModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState(""); // stored as western digits "09..."
    const [otp, setOtp] = useState(""); // western digits
    const [timer, setTimer] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const modalVisible = isOpen && !showQuestions;
    const step1FirstInputRef = useRef(null);
    const step2FirstInputRef = useRef(null);
    const intervalRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            logEvent("signup_modal_opened");
        }
        else {
            logEvent("signup_modal_closed");
        }
    }, [isOpen]);
    // open/close lifecycle
    useEffect(() => {
        if (!isOpen)
            return;
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
        if (!modalVisible)
            return;
        if (step === 1)
            step1FirstInputRef.current?.focus();
        else
            step2FirstInputRef.current?.focus();
    }, [modalVisible, step]);
    // countdown timer
    useEffect(() => {
        if (!modalVisible || step !== 2)
            return;
        if (intervalRef.current !== null)
            window.clearInterval(intervalRef.current);
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
        if (!modalVisible)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [modalVisible, onClose]);
    useEffect(() => {
        if (showTerms)
            logEvent("terms_opened");
    }, [showTerms]);
    useEffect(() => {
        if (showQuestions)
            logEvent("questions_dialog_opened");
    }, [showQuestions]);
    /* ------------------------------ handlers ------------------------------ */
    // Send OTP via server
    const handleInfoSubmit = async (e) => {
        if (e)
            e.preventDefault();
        if (!IR_MOBILE.test(phone) || !fullName)
            return;
        logEvent("signup_info_submitted", { full_name: fullName, phone });
        setSubmitting(true);
        setErrorMsg(null);
        try {
            const apiPhone = toE164Iran(phone);
            await postJSON(`/api/otp/send`, { phone: apiPhone, fullName });
            logEvent("otp_sent", { phone });
            setStep(2);
            setTimer(SERVER_OTP_TTL);
        }
        catch (err) {
            logEvent("signup_error", { stage: "otp_send", message: err?.message });
            setErrorMsg(err?.message || "خطای ناشناخته");
        }
        finally {
            setSubmitting(false);
        }
    };
    // Verify OTP via server
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 4)
            return;
        logEvent("otp_submitted", { phone });
        setSubmitting(true);
        setErrorMsg(null);
        try {
            const apiPhone = toE164Iran(phone);
            await postJSON(`/api/otp/verify`, { phone: apiPhone, code: otp });
            logEvent("otp_verified_success", { phone });
            setShowQuestions(true);
        }
        catch (err) {
            logEvent("otp_verified_failed", { phone, message: err?.message });
            setErrorMsg(err?.message || "خطای ناشناخته");
        }
        finally {
            setSubmitting(false);
        }
    };
    // Persian-digit controlled inputs
    const handlePhoneChange = (e) => {
        const raw = toWesternDigits(e.target.value);
        setPhone(raw.replace(/\s+/g, ""));
    };
    const handleOtpChange = (e) => {
        const raw = toWesternDigits(e.target.value);
        setOtp(raw.replace(/\D/g, "").slice(0, 4));
    };
    // ⛔ don't render signup modal if not visible
    if (!modalVisible) {
        return (_jsx(_Fragment, { children: showQuestions && (_jsx(QuestionsDialog, { isOpen: showQuestions, onClose: () => {
                    setShowQuestions(false);
                    onClose(); // finally close signup after finishing questions
                } })) }));
    }
    const titleId = "signup-modal-title";
    const subtitleId = "signup-modal-subtitle";
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50", role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": subtitleId, onClick: onClose, children: _jsx("div", { className: "bg-white shadow-2xl w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto overflow-hidden flex flex-col md:flex-row", onClick: (e) => e.stopPropagation(), children: step === 1 ? (_jsxs("div", { className: "flex-1 px-6 py-6 md:px-10 md:py-8", children: [_jsx(ModalHeader, { onBack: onClose, title: "\u0645\u0634\u062E\u0635\u0627\u062A", subtitle: "\u0644\u0637\u0641\u0627 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0648 \u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.", titleId: titleId, subtitleId: subtitleId, canGoBack: true }), _jsxs("form", { onSubmit: handleInfoSubmit, noValidate: true, children: [_jsx("div", { className: "mb-4", children: _jsx("input", { id: "fullName", ref: step1FirstInputRef, type: "text", placeholder: "\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC", className: "rtl-form-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-base md:text-lg", value: fullName, onChange: (e) => setFullName(e.target.value), required: true }) }), _jsxs("div", { className: "mb-4", children: [_jsx("input", { id: "phone", type: "tel", className: "rtl-form-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-base md:text-lg", value: toPersianDigits(phone), onChange: handlePhoneChange, pattern: "0?9[0-9]{9}", maxLength: 11, placeholder: "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644", required: true, "aria-invalid": phone !== "" && !IR_MOBILE.test(phone), "aria-describedby": "phone-hint" }), _jsxs("p", { id: "phone-hint", className: "mt-1 text-xs md:text-sm text-gray-500", children: ["\u0634\u0645\u0627\u0631\u0647 \u0628\u0627 ", toPersianDigits("09"), " \u0634\u0631\u0648\u0639 \u0645\u06CC\u200C\u0634\u0648\u062F."] })] }), _jsxs("div", { className: "flex items-center my-6", children: [_jsx("input", { id: "terms", type: "checkbox", checked: termsAccepted, onChange: (e) => setTermsAccepted(e.target.checked), className: "ml-2", required: true }), _jsxs("label", { htmlFor: "terms", className: "text-xs md:text-sm text-gray-700", children: [_jsx("button", { type: "button", onClick: () => setShowTerms(true), className: "text-blue-600 hover:underline", children: "\u0642\u0648\u0627\u0646\u06CC\u0646 \u0648 \u0634\u0631\u0627\u06CC\u0637" }), " ", "\u0631\u0627 \u0645\u0637\u0627\u0644\u0639\u0647 \u06A9\u0631\u062F\u0645 \u0648 \u0628\u0627 \u0622\u0646 \u0645\u0648\u0627\u0641\u0642\u0645."] })] }), _jsx("button", { type: "submit", className: "brand-blue text-white font-bold py-3 md:py-4 w-full text-base md:text-lg transition-opacity disabled:opacity-50", disabled: submitting || !termsAccepted || !fullName || !IR_MOBILE.test(phone), children: submitting ? "در حال ارسال…" : "ارسال" }), errorMsg &&
                                        _jsx("p", { className: "mt-2 text-xs md:text-sm text-red-600 text-center", children: errorMsg })] })] })) : (_jsxs("div", { className: "flex-1 px-6 py-6 md:px-10 md:py-8", children: [_jsx(ModalHeader, { onBack: () => setStep(1), title: "\u062A\u06A9\u0645\u06CC\u0644 \u0641\u0631\u0627\u06CC\u0646\u062F", subtitle: `کد تایید برای ${toPersianDigits(phone)} ارسال شد.`, titleId: titleId, subtitleId: subtitleId }), _jsxs("form", { onSubmit: handleOtpSubmit, noValidate: true, children: [_jsx("label", { htmlFor: "otp", className: "block text-sm md:text-base text-gray-700 mb-2", children: "\u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F" }), _jsx("input", { id: "otp", ref: step2FirstInputRef, type: "text", placeholder: "\u2022\u2022\u2022\u2022", className: "otp-input w-full px-4 py-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4 text-base md:text-lg", maxLength: 4, value: toPersianDigits(otp), onChange: handleOtpChange, required: true, "aria-invalid": otp !== "" && otp.length !== 4 }), _jsx("button", { type: "submit", className: "brand-blue text-white font-bold py-3 md:py-4 w-full text-base md:text-lg", disabled: submitting || otp.length !== 4, children: submitting ? "در حال بررسی…" : "نمایش سوالات" }), _jsxs("div", { className: "flex justify-between items-center my-4 gap-3", children: [_jsx("p", { className: "text-sm md:text-base text-gray-500", "aria-live": "polite", children: toPersianDigits(formatTime(timer)) }), _jsx("button", { type: "button", className: "text-xs md:text-sm text-blue-600 hover:underline disabled:opacity-50", onClick: () => handleInfoSubmit(), disabled: submitting || timer > 0, children: "\u0627\u0631\u0633\u0627\u0644 \u0645\u062C\u062F\u062F \u06A9\u062F" }), _jsx("button", { type: "button", onClick: () => setStep(1), className: "text-xs md:text-sm text-blue-600 hover:underline", children: "\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A\u061F" })] }), errorMsg &&
                                        _jsx("p", { className: "mt-2 text-xs md:text-sm text-red-600 text-center", children: errorMsg })] })] })) }) }), showQuestions && (_jsx(QuestionsDialog, { isOpen: showQuestions, onClose: () => {
                    setShowQuestions(false);
                    onClose(); // finally close signup after finishing questions
                } })), showTerms && (_jsx(TermsDialog, { isOpen: showTerms, onClose: () => setShowTerms(false), content: `` }))] }));
};
export default SignUpModal;
