import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const logEvent = (action, params) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};
export const CtaSection = ({ onOpenModal }) => {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const bgImage = isDesktop ? "/cta_bg-desktop.webp" : "/cta_bg-mobile.webp";
    return (_jsx("section", { className: "scroll-section relative h-fit bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[100svh] px-4", style: { backgroundImage: `url('${bgImage}')` }, children: _jsxs("div", { className: "relative z-10 w-full max-w-2xl mx-auto px-4 py-24 md:py-32 text-center flex flex-col items-center mb-80", children: [_jsx("h2", { className: "text-xl md:text-lg font-bold text-brand-blue leading-tight md:leading-snug", children: "\u062F\u0627\u0648 \u0628\u0627\u0648\u0631 \u062F\u0627\u0631\u0647 \u0632\u06CC\u0628\u0627\u06CC\u06CC \u0648\u0627\u0642\u0639\u06CC \u06CC\u0639\u0646\u06CC \u0647\u0645\u0648\u0646\u06CC \u06A9\u0647 \u0647\u0633\u062A\u06CC" }), _jsx("p", { className: "text-gray-700 text-lg md:text-base font-medium pt-6", children: "\u0628\u0627 \u06A9\u0645\u06A9 \u062F\u0627\u0648\u060C \u0645\u0646\u0627\u0633\u0628\u200C\u062A\u0631\u06CC\u0646 \u0634\u0627\u0645\u067E\u0648 \u0648 \u0646\u0631\u0645 \u06A9\u0646\u0646\u062F\u0647 \u0631\u0648 \u0628\u0631\u0627\u06CC \u0645\u0648\u0647\u0627\u062A \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646" }), _jsx("p", { className: "text-gray-700 text-lg md:text-base font-medium", children: "\u0648 \u0634\u0627\u0646\u0633 \u0628\u0631\u062F\u0646 \u062F\u0631 \u0642\u0631\u0639\u0647 \u06A9\u0634\u06CC \u062F\u0627\u0648 \u0631\u0648 \u0647\u0645 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634" }), _jsxs("button", { onClick: () => {
                        logEvent("cta_button_clicked", {
                            section: "cta_section",
                            label: "find_my_shampoo",
                        });
                        onOpenModal();
                    }, className: "brand-blue font-bold py-3 px-12 mt-8 shadow-md hover:opacity-90 transition-opacity w-full md:w-auto", children: [_jsx("p", { className: "text-white text-lg font-medium", children: "\u0634\u0627\u0645\u067E\u0648 \u0645\u0646\u0627\u0633\u0628 \u0645\u0648\u0647\u0627\u06CC \u062A\u0648" }), _jsx("p", { className: "text-white text-xs font-medium", children: "(\u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F)" })] })] }) }));
};
