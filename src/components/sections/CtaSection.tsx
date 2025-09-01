import type {FC} from "react";
import type {CtaSectionProps} from "../../types";

export const CtaSection: FC<CtaSectionProps> = ({onOpenModal}) => (
    <section className="scroll-section text-center bg-white">
        <div className="w-full max-w-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue">لورم ایپسوم متن ساختگی با تولید
                سادگی</h2>
            <p className="text-gray-500 mt-3 text-base">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
            <button onClick={onOpenModal}
                    className="brand-blue text-white font-bold py-3 px-12 rounded-lg mt-8 w-full shadow-md hover:opacity-90 transition-opacity text-lg">
                Call to action
            </button>
        </div>
    </section>
);
