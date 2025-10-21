import {useEffect, useRef, useState, type FC} from "react";
import {CopyLogo} from "../ui/Icons";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

type DiscountCodeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    code?: string;
    onContinue?: (code: string) => void;
    logoSrc?: string;
    accentTopColor?: string;
    title?: string;
    description?: string;
    continueUrl?: string;
};

export const DiscountCodeModal: FC<DiscountCodeModalProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  code = "",
                                                                  onContinue,
                                                                  logoSrc = "/okala_logo.webp",
                                                                  accentTopColor = "#E22533",
                                                                  title = "کد تخفیف",
                                                                  description = "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.",
                                                                  continueUrl,
                                                              }) => {
    const [value, setValue] = useState(code);
    const [copied, setCopied] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const trackEvent = (action: string, params: Record<string, any> = {}) => {
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
        } else {
            trackEvent("discount_modal_close");
        }
    }, [isOpen, code, title, logoSrc]);

    /* lock scroll */
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    /* esc to close */
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
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
        if (!isOpen) return;
        const root = cardRef.current;
        if (!root) return;

        const getFocusable = () =>
            Array.from(
                root.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute("disabled"));

        const first = getFocusable()[0];
        first?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const f = getFocusable();
            if (!f.length) return;
            const a = document.activeElement as HTMLElement | null;
            const firstEl = f[0];
            const lastEl = f[f.length - 1];
            if (!e.shiftKey && a === lastEl) {
                e.preventDefault();
                firstEl.focus();
            } else if (e.shiftKey && a === firstEl) {
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
            trackEvent("discount_code_copied", {code: value});
            setTimeout(() => setCopied(false), 1500);
        } catch {
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

    if (!isOpen) return null;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            dir="rtl"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    trackEvent("discount_modal_close_backdrop");
                    onClose();
                }
            }}
        >
            <div
                ref={cardRef}
                className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto shadow-2xl overflow-hidden "
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <img
                        src={logoSrc}
                        alt="لوگو فروشگاه"
                        className="h-8 sm:h-10 md:h-12 select-none pointer-events-none"
                    />

                    <button
                        onClick={() => {
                            trackEvent("discount_modal_close_button");
                            onClose();
                        }}
                        aria-label="بستن"
                        className="text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* body */}
                <div className="px-6 pt-6 pb-5">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight mb-4">
                        {title}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-600 leading-7 mb-6 text-justify">
                        {description}
                    </p>

                    <div className="flex w-full mb-3">
                        <button
                            onClick={handleCopy}
                            className="px-4 bg-[#001F5F] text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#001F5F]"
                            aria-label="کپی کد"
                            title="کپی کد"
                        >
                            <CopyLogo/>
                        </button>

                        <input
                            ref={inputRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="flex-1 border border-[#001F5F] text-center px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#001F5F]"
                            disabled
                            placeholder="کد را اینجا وارد کنید"
                        />
                    </div>

                    <div aria-live="polite" className="h-5 text-xs sm:text-sm text-[#001F5F] font-bold mb-4">
                        {copied ? "کپی شد!" : "\u00A0"}
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full text-brand-blue font-bold py-3 sm:py-4 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] text-sm sm:text-base"
                    >
                        ادامه
                    </button>
                </div>

                <div className="h-1 w-full" style={{backgroundColor: accentTopColor}}/>
            </div>
        </div>
    );
};

export default DiscountCodeModal;