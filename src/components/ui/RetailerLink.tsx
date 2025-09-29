import { type FC, useState } from "react";
import type { RetailerLinkProps } from "../../types";

/**
 * Improved RetailerLink
 * - If `href` is provided (non-empty): renders <a> (navigates).
 * - If `href` is empty/undefined: renders <button> (no navigation).
 * - Hover & "active" visuals preserved; focus acts like hover for keyboard users.
 * - Button variant exposes aria-pressed to screen readers.
 */
export const RetailerLink: FC<RetailerLinkProps> = ({ imgSrc, alt, href, borderColor }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const isAnchor = typeof href === "string" && href.trim().length > 0;
    const isActive = isHovering || isPressed;

    const baseClasses =
        "block w-full py-3 px-4 text-center transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-brand-blue/40 rounded";

    const inactiveClasses = "bg-white border-b-4 shadow-sm";
    const activeClasses = "bg-white border-b-4 border-2 shadow-lg scale-105";

    const commonStyle = isActive ? { borderColor } : undefined;
    const commonHandlers = {
        onMouseEnter: () => setIsHovering(true),
        onMouseLeave: () => setIsHovering(false),
        onFocus: () => setIsHovering(true), // keyboard focus behaves like hover
        onBlur: () => setIsHovering(false),
    };

    // Anchor variant — real navigation, no preventDefault
    if (isAnchor) {
        const isExternal = /^https?:\/\//i.test(href!);
        return (
            <a
                href={href}
                {...commonHandlers}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                style={commonStyle}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={alt}
                title={alt}
            >
                <img src={imgSrc} alt={alt} className="mx-auto h-8 object-contain" loading="lazy" />
            </a>
        );
    }

    // Button variant — no href, purely interactive control
    return (
        <button
            type="button"
            {...commonHandlers}
            onClick={() => setIsPressed((v) => !v)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            style={commonStyle}
            aria-label={alt}
            aria-pressed={isPressed}
            title={alt}
        >
            <img src={imgSrc} alt={alt} className="mx-auto h-8 object-contain" loading="lazy" />
        </button>
    );
};
