import {type FC, useEffect, useState} from "react";

export const HeroSection: FC = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const bgImage = isDesktop
        ? "/dove-shampoo-conditioner-desktop.webp"
        : "/dove-shampoo-conditioner-mobile.webp";

    // Calculate height based on aspect ratio
    const aspectRatio = isDesktop ? 2362 / 3543 : 2362 / 1080; // height / width

    return (
        <section
            id="hero"
            className="scroll-section relative w-full min-h-[100svh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{backgroundImage: `url('${bgImage}')`}}
        />
    );
};
