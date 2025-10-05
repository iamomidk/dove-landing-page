import {type FC, useState} from "react";
import type {RetailerLinkProps} from "../../types";

/**
 * RetailerLink
 * - If href is provided → <a> (opens in same/new tab) AND fires onActivate.
 * - If href is empty/undefined → <button> and fires onActivate.
 * - Hover/focus/active visuals preserved.
 */
export const RetailerLink: FC<RetailerLinkProps> = ({
                                                        imgSrc,
                                                        alt,
                                                        href,
                                                        borderColor,
                                                        retailer,
                                                        onActivate,
                                                        hasDiscount,
                                                    }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const isAnchor = typeof href === "string" && href.trim().length > 0;
    const isActive = isHovering || isPressed;

    const baseClasses =
        "block w-full py-3 px-4 text-center transition-all duration-300 transform focus:outline-none";
    const inactiveClasses = "border-b-4 shadow-sm";
    const activeClasses = "border-b-4 border shadow-lg scale-105";

    const commonStyle = isActive ? {borderColor} : undefined;
    const commonHandlers = {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onFocus: () => setIsHovering(true),
        onBlur: () => setIsHovering(false),
    };

    const fireActivate = (e?: React.MouseEvent) => {
        onActivate?.(retailer);
        if (e && !isAnchor) e.preventDefault();
    };

    // Common content with optional discount image
    const content = (
        <div className="flex items-center justify-center gap-2">
            {hasDiscount && (
                <img
                    src="/offer.png" // 👈 replace with your badge/discount image path
                    alt="دارای تخفیف"
                    className="h-6 object-contain"
                    loading="lazy"
                />
            )}
            <img
                src={imgSrc}
                alt={alt}
                className="h-8 object-contain p-1"
                loading="lazy"
            />
        </div>
    );

    if (isAnchor) {
        const isExternal = /^https?:\/\//i.test(href!);
        return (
            <a
                href={href}
                {...commonHandlers}
                onClick={fireActivate}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                style={commonStyle}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={alt}
                title={alt}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            {...commonHandlers}
            onClick={(e) => {
                setIsPressed((v) => !v);
                fireActivate(e);
            }}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            style={commonStyle}
            aria-label={alt}
            aria-pressed={isPressed}
            title={alt}
        >
            {content}
        </button>
    );
};
