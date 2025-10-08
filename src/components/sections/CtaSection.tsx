import { type FC, useEffect, useState } from "react";
import type { CtaSectionProps } from "../../types";

export const CtaSection: FC<CtaSectionProps> = ({ onOpenModal }) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const bgImage = isDesktop ? "/cta_bg-desktop.jpg" : "/cta_bg-mobile.jpg";

    return (
        <section
            className="scroll-section relative w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-24 md:py-32 text-center flex flex-col items-center mb-96">
                <h2 className="text-2xl md:text-4xl font-bold text-brand-blue leading-tight md:leading-snug">
                    داو باور داره زیبایی واقعی یعنی همونی که هستی
                </h2>
                <p className="text-gray-700 text-xl md:text-2xl font-semibold pt-6">
                    پس با داو همراه شو؛ شامپوی هماهنگ با موهات رو پیدا کن. هم مراقبت، هم شانس شرکت در قرعه‌کشی.
                </p>
                <button
                    onClick={onOpenModal}
                    className="brand-blue text-white font-bold py-3 px-12 mt-8 shadow-md hover:opacity-90 transition-opacity text-lg md:text-xl w-full md:w-auto"
                >
                    داستان موهای تو
                </button>
            </div>
        </section>
    );
};