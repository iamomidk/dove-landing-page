import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MenuIcon, CloseIcon, HeaderLogo } from "../ui/Icons";
import { trackEvent } from "../../analytics";
const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el)
        el.scrollIntoView({ behavior: "smooth" });
};
const NAV_ITEMS = [
    {
        label: "خانه",
        action: () => {
            scrollToSection("home-section");
            trackEvent("click_nav_home", "Navigation", "خانه");
        },
    },
    {
        label: "معرفی داو",
        action: () => {
            scrollToSection("intro-section");
            trackEvent("click_nav_intro", "Navigation", "معرفی داو");
        },
    },
];
export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (_jsxs("header", { className: "w-full fixed top-0 left-0 bg-white shadow-md z-50", children: [_jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4", children: [_jsx("div", { className: "flex items-center", children: _jsx(HeaderLogo, { className: "h-10 w-auto" }) }), _jsx("nav", { className: "hidden md:flex items-center gap-8 py-2", children: NAV_ITEMS.map((item, idx) => (_jsx("button", { onClick: item.action, className: "flex items-center text-2xl font-medium text-brand-blue hover:text-brand-blue transition-colors", children: _jsx("span", { className: "px-2", children: item.label }) }, idx))) }), _jsx("button", { className: "md:hidden text-brand-blue", onClick: () => {
                            setIsMenuOpen((p) => !p);
                            trackEvent(isMenuOpen ? "close_mobile_menu" : "open_mobile_menu", "Navigation", "Mobile Menu");
                        }, "aria-label": "Toggle Menu", children: isMenuOpen ? _jsx(CloseIcon, {}) : _jsx(MenuIcon, {}) })] }), isMenuOpen && (_jsx("div", { className: "md:hidden bg-white border-t border-gray-200 flex flex-col items-start gap-4 p-6", children: NAV_ITEMS.map((item, idx) => (_jsx("button", { onClick: () => {
                        item.action?.();
                        setIsMenuOpen(false);
                        trackEvent("click_mobile_nav", "Navigation", item.label);
                    }, className: "flex items-center text-sm font-medium text-brand-blue", children: _jsx("span", { className: "px-2", children: item.label }) }, idx))) }))] }));
};
