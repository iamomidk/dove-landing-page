import {useEffect, useMemo, useRef, useState, type FC} from "react";

/* ------------------------------- types & data ------------------------------ */

type Question = {
    id: string;
    title: string;
    options: { id: string; label: string }[];
    required?: boolean;
};

type QuestionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (answers: Record<string, string>) => void;
    questions?: Question[];
};

/* --------------------------------- helpers -------------------------------- */

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, d => persianDigits[Number(d)]);
}

/* ------------------------------- component -------------------------------- */

export const QuestionsDialog: FC<QuestionsDialogProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onSubmit,
                                                              questions,
                                                          }) => {
    const DEFAULT_QUESTIONS: Question[] = useMemo(() => ([
        {
            id: "q1",
            title: "رنگ یا دکلره",
            options: [
                {id: "o1", label: "آره"},
                {id: "o2", label: "نه"},
            ],
            required: true,
        },
        {
            id: "q2",
            title: "چند بار در هفته از شامپو استفاده می‌کنید؟",
            options: [
                {id: "o1", label: "۱–۲ بار"},
                {id: "o2", label: "۳–۴ بار"},
                {id: "o3", label: "۵ بار یا بیشتر"},
            ],
            required: true,
        },
        {
            id: "q3",
            title: "بیشتر به کدام ویژگی اهمیت می‌دهید؟",
            options: [
                {id: "o1", label: "لطافت و رطوبت"},
                {id: "o2", label: "کنترل چربی"},
                {id: "o3", label: "تقویت و ترمیم"},
                {id: "o4", label: "حجم‌دهی"},
            ],
        },
    ]), []);

    const data = questions && questions.length ? questions : DEFAULT_QUESTIONS;

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const dialogRootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    /* ------------------------------ lifecycle -------------------------------- */

    // lock scroll + reset focus context
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // esc to close
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    // focus trap
    useEffect(() => {
        if (!isOpen) return;
        const root = cardRef.current;
        if (!root) return;

        const getFocusable = () =>
            Array.from(
                root.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
                )
            ).filter(el => !el.hasAttribute("disabled"));

        // focus first element
        const firstEl = getFocusable()[0];
        firstEl?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const focusables = getFocusable();
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            }
        };

        root.addEventListener("keydown", onKeyDown);
        return () => root.removeEventListener("keydown", onKeyDown);
    }, [isOpen, step]);

    /* --------------------------------- logic --------------------------------- */

    const total = data.length;
    const current = data[step];
    const currentValue = answers[current?.id];

    const canNext = current?.required ? Boolean(currentValue) : true;

    const selectAnswer = (qid: string, oid: string) =>
        setAnswers(prev => ({...prev, [qid]: oid}));

    const goPrev = () => setStep(s => Math.max(0, s - 1));
    const goNext = () => canNext && setStep(s => Math.min(total - 1, s + 1));
    const finish = () => {
        if (!canNext) return;
        onSubmit?.(answers);
        onClose();
    };

    if (!isOpen) return null;

    /* ---------------------------------- UI ----------------------------------- */

    return (
        <div
            ref={dialogRootRef}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="questions-modal-title"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={cardRef}
                className="bg-white shadow-2xl w-full max-w-sm mx-auto rounded-none md:"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* header — mirrors SignUpModal style */}
                <div className="flex justify-end items-center px-6 pt-6">
                    <button
                        onClick={step === 0 ? onClose : goPrev}
                        className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
                        aria-label="بستن"
                    >
                        {step === 0 ? "بستن" : "قبلی"}
                    </button>
                </div>

                {/* subtitle / progress */}
                <div className="px-6 mt-2 mb-4">
                    <p className="text-lg font-bold text-brand-blue">{toPersianDigits(step + 1)}.</p>
                </div>

                {/* body */}
                <div className="px-6 pb-2">
                    <p className="mb-4 font-bold text-brand-blue">{current.title}</p>

                    <fieldset className="space-y-2" aria-label={current.title}>
                        {current.options.map(opt => {
                            const checked = currentValue === opt.id;
                            return (
                                <label
                                    key={opt.id}
                                    className={`flex items-center rounded-xl px-4 py-3 cursor-pointer transition
                    ${checked ? "border-[#003366] bg-[#003366]/5" : "border-gray-200 hover:border-gray-300"}`}
                                >
                                    <input
                                        type="radio"
                                        name={current.id}
                                        value={opt.id}
                                        checked={checked}
                                        onChange={() => selectAnswer(current.id, opt.id)}
                                        className="accent-[#003366]"
                                    />
                                    <span className="text-sm text-gray-800 mr-4">{opt.label}</span>
                                </label>
                            );
                        })}
                    </fieldset>
                </div>

                {/* footer buttons — mirrors SignUpModal buttons */}
                <div className="px-6 py-5 flex items-center justify-between w-full">
                    {step < total - 1 ? (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={!canNext}
                            className="w-full brand-blue text-white font-bold py-3  px-4 disabled:opacity-50"
                        >
                            بعدی
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={finish}
                            disabled={!canNext}
                            className="w-full brand-blue text-white font-bold py-3  px-4 disabled:opacity-50"
                        >
                            ثبت پاسخ‌ها
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionsDialog;
