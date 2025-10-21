import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { SHAMPOO_DATA, } from "../../types/shampoos";
const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toPersianDigits(input) {
    return String(input).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}
const logEvent = (action, params) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", action, params);
    }
};
function calculateShampoos(answers) {
    const color = answers["color"];
    if (color === "yes") {
        const goal = answers["colorGoal"];
        return {
            main: "color_vibrancy",
            combo: goal !== "color_vibrancy" ? goal : undefined,
        };
    }
    else {
        const type = answers["hairType"];
        const problem = answers["hairProblem"];
        if (type === problem || !problem)
            return { main: type };
        return { main: type, combo: problem };
    }
}
export const QuestionsDialog = ({ isOpen, onClose, onSubmit, questions, }) => {
    const DEFAULT_QUESTIONS = useMemo(() => [
        {
            id: "color",
            title: "موهات رنگ یا دکلره داره؟",
            options: [
                { id: "yes", label: "بله" },
                { id: "no", label: "خیر" },
            ],
            required: true,
        },
        {
            id: "colorGoal",
            title: "هدف اصلی مراقبت از موهات چیه؟",
            options: [
                { id: "intensive_repair", label: "ترمیم موهای آسیب دیده" },
                { id: "hair_fall_rescue", label: "تقویت استحکام تار موها" },
                { id: "daily_moisture", label: "حفظ رطوبت موها" },
                { id: "color_vibrancy", label: "حفظ شفافیت رنگ مو و جلوگیری از آسیب ناشی از رنگ" },
                { id: "purifying", label: "تمیزی چربی کف سر و ساقه مو" },
            ],
        },
        {
            id: "hairType",
            title: "حالت و نوع موهات رو انتخاب کن",
            options: [
                { id: "purifying", label: "چرب" },
                { id: "intensive_repair", label: "خشک و آسیب دیده" },
                { id: "hair_fall_rescue", label: "ضعیف و شکننده" },
                { id: "daily_moisture", label: "معمولی" },
            ],
        },
        {
            id: "hairProblem",
            title: "بزرگترین مشکلت با موهات چیه؟",
            options: [
                { id: "intensive_repair", label: "خشک بودن" },
                { id: "hair_fall_rescue", label: "شکننده بودن" },
                { id: "purifying", label: "چرب شدن سریع" },
                { id: "daily_moisture", label: "نیاز به حفظ رطوبت" },
            ],
        },
    ], []);
    const data = questions && questions.length ? questions : DEFAULT_QUESTIONS;
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [resultKey, setResultKey] = useState(null);
    const dialogRootRef = useRef(null);
    const cardRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            logEvent("quiz_open", { category: "questions_dialog" });
        }
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);
    const current = data[step];
    const currentValue = answers[current.id];
    const canNext = current.required ? Boolean(currentValue) : true;
    const selectAnswer = (qid, oid) => {
        setAnswers((prev) => ({ ...prev, [qid]: oid }));
        logEvent("answer_selected", { question_id: qid, option_id: oid });
    };
    const goPrev = () => setStep((s) => Math.max(0, s - 1));
    const goNext = () => {
        if (!canNext)
            return;
        logEvent("next_clicked", { step, question_id: current.id });
        // If user is answering the first question ("color")
        if (current.id === "color") {
            if (currentValue === "yes") {
                // Go directly to colorGoal
                setStep(data.findIndex(q => q.id === "colorGoal"));
            }
            else {
                // Skip colorGoal, go to hairType
                setStep(data.findIndex(q => q.id === "hairType"));
            }
            return;
        }
        // If the user answered colorGoal (for yes flow)
        if (current.id === "colorGoal" && answers["color"] === "yes") {
            finish();
            return;
        }
        // If the user is in the "no" flow, continue with hairType → hairProblem
        if (answers["color"] === "no") {
            if (current.id === "hairType") {
                setStep(data.findIndex(q => q.id === "hairProblem"));
            }
            else if (current.id === "hairProblem") {
                finish();
            }
            return;
        }
        // Default next step (fallback)
        if (step < data.length - 1) {
            setStep((s) => s + 1);
        }
    };
    const finish = () => {
        if (!canNext)
            return;
        const { main, combo } = calculateShampoos(answers);
        setResultKey({ main, combo });
        logEvent("quiz_completed", { main, combo });
        onSubmit?.(answers);
    };
    if (!isOpen)
        return null;
    const getDescriptions = () => {
        if (!resultKey)
            return [];
        const shampoo = resultKey.combo
            ? SHAMPOO_DATA[resultKey.main][resultKey.combo]
            : SHAMPOO_DATA[resultKey.main].default;
        return shampoo.descriptions;
    };
    return (_jsx("div", { ref: dialogRootRef, className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-6 z-50 overflow-auto", role: "dialog", "aria-modal": "true", "aria-labelledby": "questions-modal-title", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { ref: cardRef, className: "bg-white shadow-2xl w-full max-w-sm md:max-w-3xl mx-auto overflow-hidden", onMouseDown: (e) => e.stopPropagation(), children: [_jsx("div", { className: "px-6 py-6 md:py-8 overflow-auto max-h-[90vh]", children: !resultKey ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-end items-center mb-4", children: _jsx("button", { onClick: step === 0 ? onClose : goPrev, className: "text-sm text-gray-500 hover:text-gray-800", "aria-label": "\u0628\u0633\u062A\u0646", children: step === 0 ? "بستن" : "قبلی" }) }), _jsxs("p", { className: "text-lg font-bold text-brand-blue mb-4", children: [toPersianDigits(step + 1), "."] }), _jsx("p", { className: "mb-4 font-bold text-brand-blue text-xl", children: current.title }), _jsx("fieldset", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", "aria-label": current.title, children: current.options.map((opt) => {
                                    const checked = currentValue === opt.id;
                                    return (_jsxs("label", { className: `flex items-center rounded-xl px-4 py-3 cursor-pointer transition border ${checked
                                            ? "border-[#003366] bg-[#003366]/5"
                                            : "border-gray-200 hover:border-gray-300"}`, children: [_jsx("input", { type: "radio", name: current.id, value: opt.id, checked: checked, onChange: () => selectAnswer(current.id, opt.id), className: "accent-[#003366]" }), _jsx("span", { className: "text-xl text-gray-800 mr-4", children: opt.label })] }, opt.id));
                                }) })] })) : (
                    /* Result */
                    _jsxs("div", { className: "text-center py-4 px-2", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx("button", { onClick: onClose, className: "text-sm text-gray-500 hover:text-gray-800", "aria-label": "\u0628\u0633\u062A\u0646", children: "\u0628\u0633\u062A\u0646" }) }), _jsx("img", { src: resultKey.combo
                                    ? SHAMPOO_DATA[resultKey.main][resultKey.combo].image
                                    : SHAMPOO_DATA[resultKey.main].default.image, alt: resultKey.main, className: "w-full h-64 md:h-80 object-contain mb-4" }), _jsx("h3", { className: "text-justify font-bold py-4 md:py-8 text-[#797776] text-lg", children: "\u0627\u0632 \u0647\u0645\u0631\u0627\u0647\u06CC \u0634\u0645\u0627 \u0633\u067E\u0627\u0633\u06AF\u0632\u0627\u0631\u06CC\u0645. \u0628\u0627 \u067E\u0627\u0633\u062E \u0628\u0647 \u0633\u0648\u0627\u0644\u0627\u062A\u060C \u0648\u0627\u0631\u062F \u0642\u0631\u0639\u0647\u200C\u06A9\u0634\u06CC \u062F\u0627\u0648 \u0634\u062F\u06CC\u062F." }), _jsx("h3", { className: "text-right font-bold py-4 md:py-8 text-[#797776] text-lg", children: "\u0634\u0627\u0645\u067E\u0648\u06CC \u0645\u0646\u0627\u0633\u0628 \u0645\u0648\u0647\u0627\u06CC \u0634\u0645\u0627" }), getDescriptions().map((desc, i) => (_jsxs("div", { className: "mb-8 text-justify px-4", children: [_jsx("h3", { className: "text-lg pb-1 font-bold", style: { color: desc.color }, children: desc.title }), _jsx("ul", { className: "list-disc text-base text-gray-700 list-inside", children: desc.text
                                            .split("\n")
                                            .filter(Boolean)
                                            .map((line, i) => (_jsx("li", { style: {
                                                listStyleType: "disc",
                                            }, children: line.trim() }, i))) })] }, i)))] })) }), !resultKey && (_jsx("div", { className: "px-6 py-5 flex justify-end w-full", children: step < data.length - 1 ? (_jsx("button", { type: "button", onClick: goNext, disabled: !canNext, className: "w-full md:w-auto brand-blue text-white font-bold py-3 px-6 disabled:opacity-50 text-xl", children: "\u0628\u0639\u062F\u06CC" })) : (_jsx("button", { type: "button", onClick: finish, disabled: !canNext, className: "w-full md:w-auto brand-blue text-white font-bold py-3 px-6 disabled:opacity-50 text-xl", children: "\u062B\u0628\u062A \u067E\u0627\u0633\u062E\u200C\u0647\u0627" })) }))] }) }));
};
