import {type FC, useEffect, useState} from "react";
import type {CtaSectionProps} from "../../types";

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

const logEvent = (action: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};

export const CtaSection: FC<CtaSectionProps> = ({onOpenModal}) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const bgImage = isDesktop ? "/cta_bg-desktop.webp" : "/cta_bg-mobile.webp";

    return (
        <section
            className="scroll-section relative h-fit bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[100svh] px-4"
            style={{backgroundImage: `url('${bgImage}')`}}
        >
            <div
                className="relative z-10 w-full max-w-2xl mx-auto px-4 py-24 md:py-32 text-center flex flex-col items-center mb-80">
                <h2 className="text-xl md:text-lg font-bold text-brand-blue leading-tight md:leading-snug">
                    داو باور داره زیبایی واقعی یعنی همونی که هستی
                </h2>
                <p className="text-gray-700 text-lg md:text-base font-medium pt-6">
                    با کمک داو، مناسب‌ترین شامپو و نرم کننده رو برای موهات انتخاب کن
                </p>
                <p className="text-gray-700 text-lg md:text-base font-medium">
                    و شانس بردن در قرعه کشی داو رو هم داشته باش
                </p>
                <button
                    onClick={() => {
                        logEvent("cta_button_clicked", {
                            section: "cta_section",
                            label: "find_my_shampoo",
                        });
                        onOpenModal();
                    }}
                    className="brand-blue text-white font-bold py-3 px-12 mt-8 shadow-md hover:opacity-90 transition-opacity text-lg md:text-lg w-full md:w-auto"
                >
                    شامپو مناسب موهای تو
                </button>
            </div>
        </section>
    );
};