import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { RetailerLink } from "../ui/RetailerLink";
import { ArrowLeft, InstagramIcon, PhoneIcon } from "../ui/Icons";
import DiscountCodeModal from "../modal/DiscountCodeModal";
import { trackEvent } from "../../analytics";
export const Footer = () => {
    const [modal, setModal] = useState({
        open: false,
        code: "",
        logoSrc: "/okala_logo.webp",
        accent: "#E22533",
        title: "کد تخفیف",
        description: "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.",
        continueUrl: "",
    });
    const retailerMap = {
        okala: {
            logoSrc: "/okala_logo.webp",
            accent: "#E22533",
            code: "KGQB",
            title: "کد تخفیف",
            description: "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://www.okala.com/offer/110605",
        },
        snapp: {
            logoSrc: "/snapp_express_logo.webp",
            accent: "#FF9600",
            code: "vipcode25",
            title: "کد تخفیف",
            description: "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با ۱۵٪ تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://d.snpx.link/qtrk",
        },
    };
    const openFor = (retailer) => {
        const cfg = retailerMap[retailer];
        if (!cfg)
            return;
        // 🔹 Track GA event
        trackEvent("open_discount_modal", "Retailer", retailer);
        setModal({
            open: true,
            code: cfg.code,
            logoSrc: cfg.logoSrc,
            accent: cfg.accent,
            title: cfg.title,
            description: cfg.description,
            continueUrl: cfg.continueUrl,
        });
    };
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el)
            el.scrollIntoView({ behavior: "smooth" });
        // 🔹 Track GA event
        trackEvent("scroll_to_section", "Navigation", id);
    };
    const handleInstagramClick = () => {
        trackEvent("instagram_click", "Social", "Footer Instagram Link");
    };
    const handlePhoneClick = (number) => {
        trackEvent("phone_click", "Support", number);
    };
    const handleContinueClick = () => {
        trackEvent("continue_to_retailer", "Retailer", modal.continueUrl);
        setModal((s) => ({ ...s, open: false }));
    };
    return (_jsxs("section", { className: "flex flex-col w-full bg-gray-100", children: [_jsxs("div", { className: "w-full flex-grow flex flex-col items-center p-8 md:p-16 justify-center content-center", children: [_jsx("h2", { className: "text-xl md:text-2xl text-brand-blue text-center font-bold mb-12 md:mb-20", children: "\u0628\u0627 \u062E\u0631\u06CC\u062F \u0627\u0632 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u0627\u06A9\u0627\u0644\u0627 \u0648 \u0627\u0633\u0646\u067E \u062A\u062E\u0641\u06CC\u0641 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0646\u06CC\u062F." }), _jsxs("div", { className: "w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center justify-center", children: [_jsx(RetailerLink, { retailer: "okala", imgSrc: "/okala_logo.webp", alt: "Okala Logo", href: "", borderColor: "#E22533", onActivate: openFor, hasDiscount: true }), _jsx(RetailerLink, { retailer: "snapp", imgSrc: "/snapp_express_logo.webp", alt: "Snapp! Express Logo", href: "", borderColor: "#FF9600", onActivate: openFor, hasDiscount: true }), _jsx(RetailerLink, { retailer: "digikala", imgSrc: "/digikala_logo.webp", alt: "Digikala Logo", href: "https://www.digikala.com/product-list/plp_340034663/", borderColor: "#ED1944", onActivate: () => {
                                    trackEvent("digikala_click", "Retailer", "Digikala");
                                    window.open("https://www.digikala.com/product-list/plp_340034663/", "_blank", "noopener,noreferrer");
                                }, hasDiscount: false })] })] }), _jsxs("footer", { className: "relative w-full text-white bg-[#001F5F] mt-16", children: [_jsx("img", { src: "/concave_top.svg", alt: "Footer curve", className: "h-auto w-full -mt-1" }), _jsxs("div", { className: "w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 px-6 md:px-12 pb-10 pt-20 items-center", children: [_jsxs("div", { className: "flex flex-col items-start", children: [_jsx("img", { src: "/Footer.svg", alt: "Dove Logo", className: "h-16 w-auto mb-4" }), _jsxs("div", { className: "text-sm space-y-2", children: [_jsx("p", { className: "text-base pt-4", children: "\u062F\u0641\u062A\u0631 \u0645\u0631\u06A9\u0632\u06CC" }), _jsx("p", { className: "text-sm py-4", children: "\u062A\u0647\u0631\u0627\u0646\u060C \u0645\u06CC\u062F\u0627\u0646 \u0622\u0631\u0698\u0627\u0646\u062A\u06CC\u0646\u060C \u062E\u06CC\u0627\u0628\u0627\u0646 \u0632\u0627\u06AF\u0631\u0633\u060C \u0646\u0628\u0634 \u062E\u06CC\u0627\u0628\u0627\u0646 \u06F3\u06F3\u060C \u067E\u0644\u0627\u06A9 \u06F2\u06F3 \u06A9\u062F \u067E\u0633\u062A\u06CC: \u06F1\u06F5\u06F1\u06F6\u06F6\u06F8\u06F3\u06F1\u06F1\u06F1" }), _jsx("p", { className: "text-sm pb-4", children: "\u062A\u0645\u0627\u0645\u06CC \u062D\u0642\u0648\u0642 \u0645\u0627\u062F\u06CC \u0648 \u0645\u0639\u0646\u0648\u06CC \u0627\u06CC\u0646 \u0648\u0628 \u0633\u0627\u06CC\u062A \u0628\u0647 \u06AF\u0631\u0648\u0647 \u062F\u0627\u0648 \u062A\u0639\u0644\u0642 \u062F\u0627\u0631\u062F \u00A9 2025" })] })] }), _jsxs("div", { className: "flex flex-col items-start", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-start gap-6 mt-32", children: [_jsxs("button", { className: "flex items-center", onClick: () => scrollToSection("home-section"), children: [_jsx(ArrowLeft, {}), _jsx("span", { className: "text-sm px-2", children: "\u062E\u0627\u0646\u0647" })] }), _jsxs("button", { className: "flex items-center", onClick: () => scrollToSection("intro-section"), children: [_jsx(ArrowLeft, {}), _jsx("span", { className: "text-sm px-2", children: "\u0645\u0639\u0631\u0641\u06CC \u062F\u0627\u0648" })] }), _jsxs("div", { className: "flex text-sm", children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx(PhoneIcon, {}), _jsx("span", { className: "px-2", children: "\u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC" })] }), _jsx("a", { dir: "ltr", href: "tel:02126216403", className: "pl-8 hover:underline", onClick: () => handlePhoneClick("02126216403"), children: "\u06F0\u06F2\u06F1 \u06F2\u06F6\u06F2\u06F1 \u06F6\u06F4\u06F0\u06F3" }), _jsx("a", { dir: "ltr", href: "tel:02126217005", className: "pl-8 hover:underline", onClick: () => handlePhoneClick("02126217005"), children: "\u06F0\u06F2\u06F1 \u06F2\u06F6\u06F2\u06F1 \u06F7\u06F0\u06F0\u06F5" })] })] }), _jsxs("a", { href: "https://www.instagram.com/dove.iran?igsh=dXgwenp6OG1hcWt3", target: "_blank", rel: "noopener noreferrer", className: "flex items-start pt-6", onClick: handleInstagramClick, children: [_jsx(InstagramIcon, {}), _jsx("span", { className: "text-sm px-2", children: "\u0645\u0627 \u0631\u0627 \u062F\u0631 \u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC \u062F\u0646\u0628\u0627\u0644 \u06A9\u0646\u06CC\u062F." })] })] })] })] }), _jsx(DiscountCodeModal, { isOpen: modal.open, onClose: () => setModal((s) => ({ ...s, open: false })), code: modal.code, logoSrc: modal.logoSrc, accentTopColor: modal.accent, title: modal.title, description: modal.description, onContinue: handleContinueClick, continueUrl: modal.continueUrl })] }));
};
