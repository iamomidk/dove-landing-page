import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
const logEvent = (action, params) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};
export const TermsDialog = ({ isOpen, onClose, title = "قوانین و مقررات", content, }) => {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            logEvent("terms_dialog_opened");
        }
        else {
            logEvent("terms_dialog_closed");
        }
    }, [isOpen]);
    // Prevent background scrolling
    useEffect(() => {
        if (!isOpen)
            return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);
    // Close on Escape
    useEffect(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsx("div", { ref: dialogRef, className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { className: "bg-white w-full max-w-lg mx-auto shadow-2xl overflow-hidden", onMouseDown: (e) => e.stopPropagation(), children: [_jsx("div", { className: "px-6 py-4 border-b", children: _jsx("h2", { className: "text-lg font-bold text-right", children: title }) }), _jsx("div", { className: "p-6 max-h-[60vh] overflow-y-auto text-brand-blue", children: _jsxs("div", { dir: "rtl", lang: "fa", className: "whitespace-pre-wrap break-words text-right leading-7", children: [_jsx("h1", { className: "text-2xl font-bold text-center mb-6", children: "\u0642\u0648\u0627\u0646\u06CC\u0646 \u0648 \u0645\u0642\u0631\u0631\u0627\u062A \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u062F\u0627\u0648" }), _jsx("p", { className: "mb-4", children: "\u0628\u0627 \u0634\u0631\u06A9\u062A \u062F\u0631 \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u062F\u0627\u0648\u060C \u0634\u0645\u0627 \u0628\u0627 \u062A\u0645\u0627\u0645\u06CC \u0634\u0631\u0627\u06CC\u0637 \u0648 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0632\u06CC\u0631 \u0645\u0648\u0627\u0641\u0642\u062A \u0645\u06CC\u200C\u0646\u0645\u0627\u06CC\u06CC\u062F." }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u06F1. \u0634\u0631\u0627\u06CC\u0637 \u06A9\u0644\u06CC" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 pr-4", children: [_jsx("li", { children: "\u0627\u06CC\u0646 \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u0628\u0647 \u0635\u0648\u0631\u062A \u0622\u0646\u0644\u0627\u06CC\u0646 \u0628\u0631\u06AF\u0632\u0627\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0634\u0631\u06A9\u062A \u062F\u0631 \u0622\u0646 \u0628\u0631\u0627\u06CC \u0639\u0645\u0648\u0645 \u0622\u0632\u0627\u062F \u0627\u0633\u062A." }), _jsx("li", { children: "\u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u062F\u0631 \u067E\u0627\u06CC\u0627\u0646 \u06A9\u0645\u067E\u06CC\u0646 \u0627\u0646\u062C\u0627\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F." }), _jsx("li", { children: "\u062F\u0631 \u0627\u0646\u062A\u0647\u0627 \u062A\u0639\u062F\u0627\u062F \u06F8 \u0628\u0631\u0646\u062F\u0647 \u0627\u0632 \u0645\u06CC\u0627\u0646 \u0634\u0631\u06A9\u062A\u200C\u06A9\u0646\u0646\u062F\u06AF\u0627\u0646\u060C \u0628\u0647 \u0642\u06CC\u062F \u0642\u0631\u0639\u0647\u060C \u0627\u0646\u062A\u062E\u0627\u0628 \u062E\u0648\u0627\u0647\u0646\u062F \u0634\u062F \u06A9\u0647 \u0647\u0631 \u06CC\u06A9 \u067E\u06A9 \u06A9\u0627\u0645\u0644 \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u062F\u0627\u0648 \u0648 \u06CC\u06A9 \u0627\u062A\u0648 \u0645\u0648\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u062E\u0648\u0627\u0647\u0646\u062F \u06A9\u0631\u062F." })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u06F2. \u0646\u062D\u0648\u0647 \u0634\u0631\u06A9\u062A \u062F\u0631 \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 pr-4", children: [_jsx("li", { children: "\u0628\u0631\u0627\u06CC \u0634\u0631\u06A9\u062A \u062F\u0631 \u062C\u0634\u0646\u0648\u0627\u0631\u0647\u060C \u06A9\u0627\u0641\u06CC \u0627\u0633\u062A \u0628\u0639\u062F \u0627\u0632 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0648\u0627\u0631\u062F \u0628\u062E\u0634 \u067E\u0627\u0633\u062E \u0628\u0647 \u0633\u0648\u0627\u0644\u0627\u062A \u0634\u0648\u06CC\u062F." }), _jsx("li", { children: "\u0635\u0631\u0641\u0627\u064B \u0635\u0627\u062D\u0628 \u062E\u0637 \u062A\u0644\u0641\u0646 \u0647\u0645\u0631\u0627\u0647\u06CC \u06A9\u0647 \u06A9\u062F \u062A\u0627\u06CC\u06CC\u062F \u0631\u0627 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648 \u0627\u0631\u0633\u0627\u0644 \u0645\u06CC\u200C\u06A9\u0646\u062F\u060C \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0628\u0631\u0646\u062F\u0647 \u0634\u0646\u0627\u062E\u062A\u0647 \u062E\u0648\u0627\u0647\u062F \u0634\u062F." }), _jsx("li", { children: "\u0647\u0631 \u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 \u0647\u0645\u0631\u0627\u0647 \u0641\u0642\u0637 \u06CC\u06A9\u200C\u0628\u0627\u0631 \u0642\u0627\u0628\u0644\u06CC\u062A \u0634\u0631\u06A9\u062A \u062F\u0631 \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u0631\u0627 \u062F\u0627\u0631\u062F." })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-2", children: "\u06F3. \u0634\u0631\u0627\u06CC\u0637 \u0627\u062D\u0631\u0627\u0632 \u0647\u0648\u06CC\u062A \u0648 \u062F\u0631\u06CC\u0627\u0641\u062A \u0647\u062F\u0627\u06CC\u0627" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 pr-4", children: [_jsx("li", { children: "\u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u062C\u0627\u06CC\u0632\u0647\u060C \u0627\u0631\u0627\u0626\u0647 \u0645\u062F\u0627\u0631\u06A9 \u0634\u0646\u0627\u0633\u0627\u06CC\u06CC \u0645\u0639\u062A\u0628\u0631 (\u0634\u0627\u0645\u0644 \u06A9\u0627\u0631\u062A \u0645\u0644\u06CC \u0648 \u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0645\u0627\u0644\u06A9\u06CC\u062A \u062E\u0637) \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A." }), _jsx("li", { children: "\u062C\u0627\u06CC\u0632\u0647 \u0641\u0642\u0637 \u0628\u0647 \u062E\u0648\u062F \u0634\u062E\u0635 \u0628\u0631\u0646\u062F\u0647 (\u0635\u0627\u062D\u0628 \u062E\u0637 \u0627\u0631\u0633\u0627\u0644\u200C\u06A9\u0646\u0646\u062F\u0647 \u06A9\u062F \u06A9\u0647 \u0645\u062F\u0627\u0631\u06A9 \u0647\u0648\u06CC\u062A\u06CC \u0645\u0639\u062A\u0628\u0631 \u0627\u0631\u0627\u0626\u0647 \u062F\u0627\u062F\u0647 \u0627\u0633\u062A) \u062A\u062D\u0648\u06CC\u0644 \u062F\u0627\u062F\u0647 \u062E\u0648\u0627\u0647\u062F \u0634\u062F." }), _jsx("li", { children: "\u0646\u062A\u0627\u06CC\u062C \u062C\u0634\u0646\u0648\u0627\u0631\u0647 \u0627\u0632 \u0637\u0631\u06CC\u0642 \u0631\u0633\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0631\u0633\u0645\u06CC \u0628\u0631\u0646\u062F \u062F\u0627\u0648 \u0627\u0637\u0644\u0627\u0639\u200C\u0631\u0633\u0627\u0646\u06CC \u062E\u0648\u0627\u0647\u062F \u0634\u062F." })] })] })] }) }), _jsx("div", { className: "px-6 py-4 border-t flex justify-end", children: _jsx("button", { onClick: () => {
                            logEvent("terms_dialog_closed_button");
                            onClose();
                        }, className: "px-4 py-2 bg-brand-blue text-white font-bold hover:bg-blue-800 transition", children: "\u0628\u0633\u062A\u0646" }) })] }) }));
};
export default TermsDialog;
