import {useEffect, useRef, useState, type FC} from "react";
import {CopyLogo} from "../ui/Icons";

type DiscountCodeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    code?: string;
    onContinue?: (code: string) => void;
    logoSrc?: string;              // retailer logo in header (right side)
    accentTopColor?: string;       // thin accent bar on top
    title?: string;                // modal title
    description?: string;          // modal body text
    continueUrl?: string;
};

export const DiscountCodeModal: FC<DiscountCodeModalProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                                  code = "",
                                                                  onContinue,
                                                                  logoSrc = "/okala_logo.png",
                                                                  accentTopColor = "#E22533",
                                                                  title = "کد تخفیف",
                                                                  description = "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.",
                                                                  continueUrl
                                                              }) => {
    const [value, setValue] = useState(code);
    const [copied, setCopied] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
            ).filter(el => !el.hasAttribute("disabled"));

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
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* noop */
        }
    };

    const handleContinue = () => {
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
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={cardRef}
                className="bg-white w-full max-w-sm mx-auto shadow-2xl  overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >

                {/* header */}
                <div className="flex items-start justify-between px-5 pt-4">
                    {/* logo (left) */}
                    <img
                        src={logoSrc}
                        alt="لوگو فروشگاه"
                        className="h-auto select-none pointer-events-none"
                    />

                    {/* close (right) */}
                    <button
                        onClick={onClose}
                        aria-label="بستن"
                        className="text-gray-400 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
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
                <div className="px-6 pt-3 pb-4">
                    <h2 className="text-xl font-extrabold text-gray-400 tracking-tight my-4">
                        {title}
                    </h2>

                    <p className="text-[13px] text-gray-600 leading-6 mb-6 text-justify">
                        {description}
                    </p>

                    {/* input + copy */}
                    <div className="flex w-full mb-3">
                        <button
                            onClick={handleCopy}
                            className="px-3 bg-[#001F5F] text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#001F5F]"
                            aria-label="کپی کد"
                            title="کپی کد"
                        >
                            <CopyLogo/>
                        </button>

                        <input
                            ref={inputRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="flex-1 border border-[#001F5F] text-center  px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001F5F]"
                            disabled={true}
                            placeholder="کد را اینجا وارد کنید"
                        />
                    </div>

                    <div aria-live="polite" className="h-5 text-xs text-[#001F5F] font-bold">
                        {copied ? "کپی شد!" : "\u00A0"}
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        className="w-full text-brand-blue font-bold py-3  hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366]"
                    >
                        ادامه
                    </button>
                </div>

                <div className="h-4"/>

                {/* bottom accent */}
                <div className="h-1 w-full" style={{backgroundColor: accentTopColor}}/>
            </div>
        </div>
    );
};

export default DiscountCodeModal;
