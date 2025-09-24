import type {FC} from "react";
import type {CtaSectionProps} from "../../types";

export const CtaSection: FC<CtaSectionProps> = ({onOpenModal}) => (
    <section className="scroll-section text-center bg-white">
        <div className="w-full max-w-xs">
            <h2 className="text-xl sm:text-3xl font-black text-brand-blue">داو باور داره زیبایی واقعی یعنی همونی که هستی</h2>
            <p className="text-gray-500 mt-3 text-base">پس با داو همراه شو؛ شامپوی هماهنگ با موهات رو پیدا کن.
                هم مراقبت، هم شانس شرکت در قرعه‌کشی.</p>
            <button onClick={onOpenModal}
                    className="brand-blue text-white font-bold py-3 px-12 mt-8 w-full shadow-md hover:opacity-90 transition-opacity text-lg">
                داستان موهای تو
            </button>
        </div>
    </section>
);
