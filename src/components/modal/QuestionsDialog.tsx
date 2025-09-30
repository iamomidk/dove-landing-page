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
    /**
     * Optional: If you pass your own questions, the component will still apply
     * the same branching (q1 -> q2_true/q2_false -> q3) IF your ids match:
     * q1, q2_true, q2_false, q3. Otherwise it falls back to the built-in flow.
     */
    questions?: Question[];
};

/* --------------------------------- helpers -------------------------------- */

const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, d => persianDigits[Number(d)]);
}

/* ----------------------- default branching questions ----------------------- */

const BUILTIN_QUESTIONS: Record<string, Question> = {
    q1: {
        id: "q1",
        title: "رنگ یا دکلره",
        options: [
            {id: "o1", label: "آره"},
            {id: "o2", label: "نه"},
        ],
        required: true,
    },
    q2_true: {
        id: "q2_true",
        title: "هدف اصلی مراقبت از موهات چیه؟",
        options: [
            {id: "o1", label: "ترمیم موهای آسیب دیده "},
            {id: "o2", label: "تقویتاستحکام تار  موها"},
            {id: "o3", label: "حفظ رطوبت موها"},
            {id: "o4", label: "حفظ شفافیت رنگ موها، ترمیم آسیب دیدگی مو یا جلوگیری از  آسیب ناشی از رنگ شدگی موها"},
            {id: "o5", label: "تمیزی چربی کف سر و ساقه مو"},
        ],
        required: true,
    },
    q2_false: {
        id: "q2_false",
        title: "حالت و نوع موهات رو به صورت کلی انتخاب کن",
        options: [
            {id: "o1", label: "چرب و سبک"},
            {id: "o2", label: "خشک و وز"},
            {id: "o3", label: "نازک و شکننده"},
            {id: "o4", label: "معمولی"},
        ],
        required: true,
    },
    q3: {
        id: "q3",
        title: "بزرگ‌ترین مشکلت با موهات چیه؟",
        options: [
            {id: "o1", label: "وز و خشک بودن "},
            {id: "o2", label: "ریزش از ساقه داره و شکننده بودن"},
            {id: "o3", label: "چرب شدن سریع"},
            {id: "o4", label: "نیاز به حفظ رطوبت"},
        ],
        required: true,
    },
};

/* ------------------------------- component -------------------------------- */

export const QuestionsDialog: FC<QuestionsDialogProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onSubmit,
                                                              questions,
                                                          }) => {
    /**
     * If custom questions are passed and they use the same ids (q1, q2_true, q2_false, q3),
     * they’ll be used; otherwise we fall back to BUILTIN_QUESTIONS.
     */
    const BANK = useMemo(() => {
        if (!questions?.length) return BUILTIN_QUESTIONS;

        const byId: Record<string, Question> = {};
        for (const q of questions) byId[q.id] = q;

        const hasAllIds = ["q1", "q2_true", "q2_false", "q3"].every(id => byId[id]);
        return hasAllIds ? byId : BUILTIN_QUESTIONS;
    }, [questions]);

    // answers keyed by question id → option id
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [step, setStep] = useState(0);

    const dialogRootRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    /* ------------------------------ lifecycle -------------------------------- */

    // lock scroll
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

    // Build the dynamic sequence based on answers so far
    const sequence: Question[] = useMemo(() => {
        const s: Question[] = [];
        s.push(BANK.q1);

        const q1Val = answers["q1"];
        if (q1Val === "o1") {
            // آره → فقط q2_true (بدون q3)
            s.push(BANK.q2_true);
        } else if (q1Val === "o2") {
            // نه → q2_false سپس q3
            s.push(BANK.q2_false);
            s.push(BANK.q3);
        }

        return s;
    }, [answers, BANK]);

    const total = sequence.length;
    const current = sequence[Math.min(step, total - 1)];
    const currentValue = current ? answers[current.id] : undefined;

    const canNext = current?.required ? Boolean(currentValue) : true;

    const selectAnswer = (qid: string, oid: string) =>
        setAnswers(prev => {
            // If user changes q1, clear the opposite branch answers
            if (qid === "q1" && prev[qid] !== oid) {
                const next = {...prev, [qid]: oid};
                delete next["q2_true"];
                delete next["q2_false"];
                // Also guard step in case sequence shrinks
                // (handled below by effect watching sequence)
                return next;
            }
            return {...prev, [qid]: oid};
        });

    const goPrev = () => setStep(s => Math.max(0, s - 1));
    const goNext = () => canNext && setStep(s => Math.min(total - 1, s + 1));
    const finish = () => {
        if (!canNext) return;
        onSubmit?.(answers);
        onClose();
    };

    // If sequence shrank (because q1 changed), keep step in bounds
    useEffect(() => {
        setStep(s => Math.min(s, Math.max(0, sequence.length - 1)));
    }, [sequence.length]);

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
                className="bg-white shadow-2xl w-full max-w-sm mx-auto rounded-none"
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
                                    className={`flex items-center rounded-xl px-4 py-3 cursor-pointer transition border
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