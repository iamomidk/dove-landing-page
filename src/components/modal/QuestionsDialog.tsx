import {useEffect, useMemo, useRef, useState, type FC} from "react";
import {
    SHAMPOO_DATA,
    type ShampooDescription,
    type ShampooCategory,
    type ShampooVariant,
} from "../../types/shampoos";

/* ------------------------------- types & data ------------------------------ */

type Question = {
    id: string;
    title: string;
    options: { id: ShampooCategory | "yes" | "no"; label: string }[]; // enforce shampoo categories here
    required?: boolean;
};

type QuestionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (answers: Record<string, string>) => void;
    questions?: Question[];
};

/* ------------------------------- helpers --------------------------------- */

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

/* --------------------------- shampoo logic --------------------------- */

function calculateShampoos(
    answers: Record<string, string>
): { main: ShampooCategory; combo?: ShampooCategory } {
    const color = answers["color"];
    if (color === "yes") {
        const goal = answers["colorGoal"] as ShampooCategory;
        return {
            main: "color_vibrancy",
            combo: goal !== "color_vibrancy" ? goal : undefined,
        };
    } else {
        const type = answers["hairType"] as ShampooCategory;
        const problem = answers["hairProblem"] as ShampooCategory | undefined;
        if (type === problem || !problem) return {main: type};
        return {main: type, combo: problem};
    }
}

/* ------------------------------- component -------------------------------- */

export const QuestionsDialog: FC<QuestionsDialogProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onSubmit,
                                                              questions,
                                                          }) => {
    const DEFAULT_QUESTIONS: Question[] = useMemo(
        () => [
            {
                id: "color",
                title: "رنگ یا دکلره کرده‌ای؟",
                options: [
                    {id: "yes", label: "آره"},
                    {id: "no", label: "نه"},
                ],
                required: true,
            },
            {
                id: "colorGoal",
                title: "هدف اصلی مراقبت از موهات چیه؟",
                options: [
                    {id: "intensive_repair", label: "ترمیم موهای آسیب دیده"},
                    {id: "hair_fall_rescue", label: "تقویت استحکام تار موها"},
                    {id: "daily_moisture", label: "حفظ رطوبت موها"},
                    {id: "color_vibrancy", label: "حفظ شفافیت رنگ موها"},
                    {id: "purifying", label: "تمیزی چربی کف سر و ساقه مو"},
                ],
            },
            {
                id: "hairType",
                title: "حالت و نوع موهات رو انتخاب کن",
                options: [
                    {id: "purifying", label: "چرب و سبک"},
                    {id: "intensive_repair", label: "خشک و وز"},
                    {id: "hair_fall_rescue", label: "نازک و شکننده"},
                    {id: "daily_moisture", label: "معمولی"},
                ],
            },
            {
                id: "hairProblem",
                title: "بزرگترین مشکلت با موهات چیه؟",
                options: [
                    {id: "intensive_repair", label: "وز و خشک بودن"},
                    {id: "hair_fall_rescue", label: "ریزش و شکنندگی"},
                    {id: "purifying", label: "چرب شدن سریع"},
                    {id: "daily_moisture", label: "نیاز به حفظ رطوبت"},
                ],
            },
        ],
        []
    );

    const data = questions && questions.length ? questions : DEFAULT_QUESTIONS;

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [resultKey, setResultKey] = useState<
        { main: ShampooCategory; combo?: ShampooCategory } | null
    >(null);

    const dialogRootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    /* ---------------------- lifecycle ---------------------- */

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    /* ---------------------- logic ---------------------- */

    const current = data[step];
    const currentValue = answers[current.id];
    const canNext = current.required ? Boolean(currentValue) : true;

    const selectAnswer = (qid: string, oid: string) =>
        setAnswers((prev) => ({...prev, [qid]: oid}));

    const goPrev = () => setStep((s) => Math.max(0, s - 1));

    const goNext = () => {
        if (!canNext) return;

        if (current.id === "color" && currentValue === "yes") {
            setStep(1); // jump to colorGoal
        } else if (current.id === "colorGoal" && answers["color"] === "yes") {
            finish();
        } else if (step < data.length - 1) {
            setStep((s) => s + 1);
        }
    };

    const finish = () => {
        if (!canNext) return;
        const {main, combo} = calculateShampoos(answers);
        setResultKey({main, combo});
        onSubmit?.(answers);
    };

    if (!isOpen) return null;

    /* ----------------------------- helpers ----------------------------- */

    const getDescriptions = (): ShampooDescription[] => {
        if (!resultKey) return [];
        const shampoo: ShampooVariant =
            resultKey.combo
                ? SHAMPOO_DATA[resultKey.main][resultKey.combo]!
                : SHAMPOO_DATA[resultKey.main].default;

        return shampoo.descriptions;
    };

    /* ----------------------------- UI ----------------------------- */

    return (
        <div
            ref={dialogRootRef}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="questions-modal-title"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                ref={cardRef}
                className="bg-white shadow-2xl w-full max-w-sm mx-auto rounded-none"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="px-6 pb-2">
                    {!resultKey ? (
                        /* ---- Question Flow ---- */
                        <>
                            {/* Navigation */}
                            <div className="flex justify-end items-center px-6 pt-6">
                                <button
                                    onClick={step === 0 ? onClose : goPrev}
                                    className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
                                    aria-label="بستن"
                                >
                                    {step === 0 ? "بستن" : "قبلی"}
                                </button>
                            </div>

                            {/* Step Indicator */}
                            <div className="px-6 mt-2 mb-4">
                                <p className="text-lg font-bold text-brand-blue">
                                    {toPersianDigits(step + 1)}.
                                </p>
                            </div>

                            {/* Question */}
                            <p className="mb-4 font-bold text-brand-blue">{current.title}</p>
                            <fieldset className="space-y-2" aria-label={current.title}>
                                {current.options.map((opt) => {
                                    const checked = currentValue === opt.id;
                                    return (
                                        <label
                                            key={opt.id}
                                            className={`flex items-center rounded-xl px-4 py-3 cursor-pointer transition
                      ${
                                                checked
                                                    ? "border-[#003366] bg-[#003366]/5"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={current.id}
                                                value={opt.id}
                                                checked={checked}
                                                onChange={() => selectAnswer(current.id, opt.id)}
                                                className="accent-[#003366]"
                                            />
                                            <span className="text-sm text-gray-800 mr-4">
                        {opt.label}
                      </span>
                                        </label>
                                    );
                                })}
                            </fieldset>
                        </>
                    ) : (
                        /* ---- Result ---- */
                        <div className="text-center py-4">
                            <div className="flex justify-end items-center">
                                <button
                                    onClick={onClose}
                                    className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
                                    aria-label="بستن"
                                >
                                    بستن
                                </button>
                            </div>

                            <img
                                src={
                                    resultKey.combo
                                        ? SHAMPOO_DATA[resultKey.main][resultKey.combo]!.image
                                        : SHAMPOO_DATA[resultKey.main].default.image
                                }
                                alt={resultKey.main}
                                className="w-full h-56 object-contain mb-4"
                            />

                            <h3 className="text-right font-bold py-8 text-[#797776]">
                                شامپوی مناسب موهای شما
                            </h3>

                            {getDescriptions().map((desc, i) => (
                                <div
                                    key={i}
                                    className="mb-4 text-justify pr-4 border-r-2"
                                    style={{borderColor: desc.color}}
                                >
                                    <h3
                                        className="text-base pb-1 font-bold"
                                        style={{color: desc.color}}
                                    >
                                        {desc.title}
                                    </h3>
                                    {desc.text && (
                                        <p className="text-sm text-gray-700">{desc.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!resultKey && (
                    <div className="px-6 py-5 flex items-center justify-between w-full">
                        {step < data.length - 1 ? (
                            <button
                                type="button"
                                onClick={goNext}
                                disabled={!canNext}
                                className="w-full brand-blue text-white font-bold py-3 px-4 disabled:opacity-50"
                            >
                                بعدی
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={finish}
                                disabled={!canNext}
                                className="w-full brand-blue text-white font-bold py-3 px-4 disabled:opacity-50"
                            >
                                ثبت پاسخ‌ها
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
