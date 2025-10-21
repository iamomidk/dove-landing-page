import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export const HeroSection = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    useEffect(() => {
        const updateLayout = () => {
            setIsDesktop(window.innerWidth >= 768);
            const header = document.querySelector("header");
            if (header)
                setHeaderHeight(header.offsetHeight);
        };
        updateLayout();
        window.addEventListener("resize", updateLayout);
        return () => window.removeEventListener("resize", updateLayout);
    }, []);
    const bgImage = isDesktop
        ? "/dove-shampoo-conditioner-desktop.webp"
        : "/dove-shampoo-conditioner-mobile.webp";
    return (_jsx("section", { id: "hero", className: "scroll-section", style: {
            backgroundImage: `url('${bgImage}')`,
        } }));
};
