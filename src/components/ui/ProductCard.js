import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useState } from "react";
const sendGAEvent = (action, label) => {
    if (typeof window.gtag === "function") {
        window.gtag("event", action, {
            event_category: "Product Card",
            event_label: label,
        });
    }
};
export const ProductCard = ({ product }) => {
    const [isActive, setIsActive] = useState(false);
    const overlayId = useId();
    const toggleOverlay = () => {
        setIsActive((v) => !v);
        sendGAEvent(!isActive ? "open_overlay" : "close_overlay", product.title);
    };
    const closeOverlay = () => {
        if (isActive) {
            setIsActive(false);
            sendGAEvent("close_overlay", product.title);
        }
    };
    // Close on ESC for a11y
    useEffect(() => {
        if (!isActive)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                closeOverlay();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isActive]);
    return (_jsxs("article", { className: `list-card-item ${isActive ? "active" : ""}`, onMouseLeave: closeOverlay, "aria-labelledby": `${overlayId}-title`, children: [_jsxs("div", { className: "card-item--image", children: [_jsx("div", { className: "cmp-image", children: _jsxs("picture", { children: [_jsx("source", { srcSet: product.imgSrc, media: "screen and (min-width: 320px)" }), _jsx("img", { src: product.imgSrc, className: "cmp-image__image", alt: product.title, loading: "lazy", onClick: () => sendGAEvent("click_image", product.title) })] }) }), _jsx("button", { type: "button", onClick: toggleOverlay, className: "absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-white/70", "aria-expanded": isActive, "aria-controls": overlayId, "aria-label": isActive ? "بستن جزئیات محصول" : "نمایش جزئیات محصول", style: { background: "transparent" } }), _jsx("div", { id: overlayId, className: "card-overlay", style: { pointerEvents: isActive ? "auto" : "none" }, "aria-hidden": !isActive, children: _jsxs("div", { className: "overlay-content", children: [_jsx("h3", { id: `${overlayId}-title`, className: "overlay-title text-lg font-bold", style: { color: product.hoverTextColor }, children: product.hoverTitle }), _jsx("p", { className: "overlay-desc text-base font-semibold", style: { color: "#797776" }, children: product.hoverDesc })] }) })] }), _jsxs("div", { className: "card-item--details", children: [_jsx("div", { className: "title", children: _jsx("h3", { className: "card-title font-bold", title: product.title, children: product.title }) }), _jsx("div", { className: "card-tags", children: _jsx("ul", { className: "list-disc pr-4 text-[#001F5F] space-y-1 text-[14px]", children: product.description
                                .split("\n")
                                .filter(Boolean)
                                .map((line, i) => (_jsx("li", { children: line.trim() }, i))) }) })] })] }));
};
