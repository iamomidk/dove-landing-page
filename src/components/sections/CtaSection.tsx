import type {FC} from "react";
import type {CtaSectionProps} from "../../types";

export const CtaSection: FC<CtaSectionProps> = ({onOpenModal}) => (
    <section
        className="scroll-section text-center bg-contain bg-center bg-no-repeat relative"
        style={{backgroundImage: "url('/cta_bg.jpg')"}}
    >
        <div className="relative z-10 w-full max-w-xs mx-auto py-16 px-4">
            <h2 className="text-xl font-bold text-brand-blue whitespace-normal">
                داو باور داره زیبایی واقعی یعنی همونی که هستی
            </h2>
            <p className="text-gray-700 mt-3 text-base">
                پس با داو همراه شو؛ شامپوی هماهنگ با موهات رو پیدا کن.
                هم مراقبت، هم شانس شرکت در قرعه‌کشی.
            </p>
            <button
                onClick={onOpenModal}
                className="brand-blue text-white font-bold py-3 px-12 mt-8 w-full shadow-md hover:opacity-90 transition-opacity text-lg mb-16"
            >
                داستان موهای تو
            </button>
        </div>
    </section>
);