import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
/**
 * RetailerLink
 * - If href is provided → <a> (opens in same/new tab) AND fires onActivate.
 * - If href is empty/undefined → <button> and fires onActivate.
 * - Hover/focus/active visuals preserved.
 */
export const RetailerLink = ({ imgSrc, alt, href, borderColor, retailer, onActivate, hasDiscount, }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const isAnchor = typeof href === "string" && href.trim().length > 0;
    const isActive = isHovering || isPressed;
    const baseClasses = "block w-full py-3 px-4 text-center transition-all duration-300 transform focus:outline-none";
    const inactiveClasses = "border-b-4 shadow-sm";
    const activeClasses = "border-b-4 border shadow-lg scale-105";
    const commonStyle = isActive ? { borderColor } : undefined;
    const commonHandlers = {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onFocus: () => setIsHovering(true),
        onBlur: () => setIsHovering(false),
    };
    const fireActivate = (e) => {
        onActivate?.(retailer);
        if (e && !isAnchor)
            e.preventDefault();
    };
    // Common content with optional discount image
    const content = (_jsxs("div", { className: "flex items-center justify-center gap-2 p-4", children: [hasDiscount && (_jsx("img", { src: "/offer.webp" // 👈 replace with your badge/discount image path
                , alt: "\u062F\u0627\u0631\u0627\u06CC \u062A\u062E\u0641\u06CC\u0641", className: "h-6 object-contain", loading: "lazy" })), _jsx("img", { src: imgSrc, alt: alt, className: "h-8 object-contain", loading: "lazy" })] }));
    if (isAnchor) {
        const isExternal = /^https?:\/\//i.test(href);
        return (_jsx("a", { href: href, ...commonHandlers, onClick: fireActivate, className: `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`, style: commonStyle, target: isExternal ? "_blank" : undefined, rel: isExternal ? "noopener noreferrer" : undefined, "aria-label": alt, title: alt, children: content }));
    }
    return (_jsx("button", { type: "button", ...commonHandlers, onClick: (e) => {
            setIsPressed((v) => !v);
            fireActivate(e);
        }, className: `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`, style: commonStyle, "aria-label": alt, "aria-pressed": isPressed, title: alt, children: content }));
};
