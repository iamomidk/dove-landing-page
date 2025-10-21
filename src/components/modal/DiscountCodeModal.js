import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { CopyLogo } from "../ui/Icons";
export const DiscountCodeModal = ({ isOpen, onClose, code = "", onContinue, logoSrc = "/okala_logo.webp", accentTopColor = "#E22533", title = "کد تخفیف", description = "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.", continueUrl, }) => {
    const [value, setValue] = useState(code);
    const [copied, setCopied] = useState(false);
    const rootRef = useRef(null);
    const cardRef = useRef(null);
    const inputRef = useRef(null);
    const trackEvent = (action, params = {}) => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", action, params);
        }
    };
    /* Track open/close */
    useEffect(() => {
        if (isOpen) {
            trackEvent("discount_modal_open", {
                code,
                title,
                logoSrc,
            });
        }
        else {
            trackEvent("discount_modal_close");
        }
    }, [isOpen, code, title, logoSrc]);
    /* lock scroll */
    useEffect(() => {
        if (!isOpen)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);
    /* esc to close */
    useEffect(() => {
        if (!isOpen)
            return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                trackEvent("discount_modal_close_esc");
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);
    /* focus trap */
    useEffect(() => {
        if (!isOpen)
            return;
        const root = cardRef.current;
        if (!root)
            return;
        const getFocusable = () => Array.from(root.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute("disabled"));
        const first = getFocusable()[0];
        first?.focus();
        const onKeyDown = (e) => {
            if (e.key !== "Tab")
                return;
            const f = getFocusable();
            if (!f.length)
                return;
            const a = document.activeElement;
            const firstEl = f[0];
            const lastEl = f[f.length - 1];
            if (!e.shiftKey && a === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
            else if (e.shiftKey && a === firstEl) {
                e.preventDefault();
                lastEl.focus();
            }
        };
        root.addEventListener("keydown", onKeyDown);
        return () => root.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);
    useEffect(() => setValue(code), [code]);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            trackEvent("discount_code_copied", { code: value });
            setTimeout(() => setCopied(false), 1500);
        }
        catch {
            /* noop */
        }
    };
    const handleContinue = () => {
        trackEvent("discount_continue_clicked", {
            code: value,
            url: continueUrl,
        });
        if (continueUrl) {
            window.open(continueUrl, "_blank", "noopener,noreferrer");
        }
        onContinue?.(value);
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { ref: rootRef, className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50", role: "dialog", "aria-modal": "true", "aria-label": title, dir: "rtl", onMouseDown: (e) => {
            if (e.target === e.currentTarget) {
                trackEvent("discount_modal_close_backdrop");
                onClose();
            }
        }, children: _jsxs("div", { ref: cardRef, className: "bg-white w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto shadow-2xl overflow-hidden ", onMouseDown: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200", children: [_jsx("img", { src: logoSrc, alt: "\u0644\u0648\u06AF\u0648 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647", className: "h-8 sm:h-10 md:h-12 select-none pointer-events-none" }), _jsx("button", { onClick: () => {
                                trackEvent("discount_modal_close_button");
                                onClose();
                            }, "aria-label": "\u0628\u0633\u062A\u0646", className: "text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400", children: _jsx("svg", { viewBox: "0 0 24 24", className: "w-6 h-6 sm:w-7 sm:h-7", "aria-hidden": "true", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })] }), _jsxs("div", { className: "px-6 pt-6 pb-5", children: [_jsx("h2", { className: "text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight mb-4", children: title }), _jsx("p", { className: "text-sm sm:text-base text-gray-600 leading-7 mb-6 text-justify", children: description }), _jsxs("div", { className: "flex w-full mb-3", children: [_jsx("button", { onClick: handleCopy, className: "px-4 bg-[#001F5F] text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#001F5F]", "aria-label": "\u06A9\u067E\u06CC \u06A9\u062F", title: "\u06A9\u067E\u06CC \u06A9\u062F", children: _jsx(CopyLogo, {}) }), _jsx("input", { ref: inputRef, value: value, onChange: (e) => setValue(e.target.value), className: "flex-1 border border-[#001F5F] text-center px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#001F5F]", disabled: true, placeholder: "\u06A9\u062F \u0631\u0627 \u0627\u06CC\u0646\u062C\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F" })] }), _jsx("div", { "aria-live": "polite", className: "h-5 text-xs sm:text-sm text-[#001F5F] font-bold mb-4", children: copied ? "کپی شد!" : "\u00A0" }), _jsx("button", { type: "button", onClick: handleContinue, className: "w-full text-brand-blue font-bold py-3 sm:py-4 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] text-sm sm:text-base", children: "\u0627\u062F\u0627\u0645\u0647" })] }), _jsx("div", { className: "h-1 w-full", style: { backgroundColor: accentTopColor } })] }) }));
};
export default DiscountCodeModal;
