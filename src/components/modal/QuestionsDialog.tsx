import { useEffect, useRef, useState, type ChangeEvent, type FC, type FormEvent } from "react";

export type QuestionsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (answers: Record<string, string>) => void;
};

type Answers = Record<string, string>;

export const QuestionsDialog: FC<QuestionsDialogProps> = ({ isOpen, onClose, onSubmit }) => {
    const titleId = "questions-dialog-title";
    const descId = "questions-dialog-desc";

    const [answers, setAnswers] = useState<Answers>({});
    const firstFieldRef = useRef<HTMLInputElement | null>(null);

    // Focus the first field when opened
    useEffect(() => {
        if (!isOpen) return;
        const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [isOpen]);

    // Utility: always store string values
    const setAnswer = (key: string, value: unknown) => {
        setAnswers((prev) => ({ ...prev, [key]: String(value ?? "") }));
    };

    // Handlers
    const handleText = (key: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setAnswer(key, e.target.value);

    const handleRadio = (key: string) => (e: ChangeEvent<HTMLInputElement>) => setAnswer(key, e.target.value);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(answers);
    };

    // Derived convenience reads
    const q1 = answers["q1"] ?? "";
    const q2 = answers["q2"] ?? ""; // "true" | "false" (as strings)
    const q2_true = answers["q2_true"] ?? "";
    const q2_false = answers["q2_false"] ?? "";

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white shadow-2xl rounded-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="px-6 pt-5 pb-3 border-b">
                    <h2 id={titleId} className="text-lg font-bold text-gray-900">
                        پاسخ به سوالات
                    </h2>
                    <p id={descId} className="text-sm text-gray-500 mt-1">
                        لطفا به چند سوال کوتاه پاسخ دهید.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
                    {/* Q1 */}
                    <div>
                        <label htmlFor="q1" className="block text-sm font-medium text-gray-700 mb-1">
                            سوال ۱: نام شما چیست؟
                        </label>
                        <input
                            ref={firstFieldRef}
                            id="q1"
                            name="q1"
                            type="text"
                            className="w-full border-b-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-600"
                            value={q1}
                            onChange={handleText("q1")}
                            required
                        />
                    </div>

                    {/* Q2: yes/no */}
                    <fieldset>
                        <legend className="block text-sm font-medium text-gray-700 mb-2">
                            سوال ۲: آیا از محصولات داو استفاده کرده‌اید؟
                        </legend>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="radio"
                                    name="q2"
                                    value="true"
                                    checked={q2 === "true"}
                                    onChange={handleRadio("q2")}
                                />
                                بله
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="radio"
                                    name="q2"
                                    value="false"
                                    checked={q2 === "false"}
                                    onChange={handleRadio("q2")}
                                />
                                خیر
                            </label>
                        </div>
                    </fieldset>

                    {/* Conditional detail for Q2 */}
                    {q2 === "true" && (
                        <div>
                            <label htmlFor="q2_true" className="block text-sm font-medium text-gray-700 mb-1">
                                اگر بله، کدام محصول و چه مدت؟
                            </label>
                            <input
                                id="q2_true"
                                name="q2_true"
                                type="text"
                                className="w-full border-b-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-600"
                                value={q2_true}
                                onChange={handleText("q2_true")}
                                placeholder="مثلا: شامپو داو، ۶ ماه"
                            />
                        </div>
                    )}

                    {q2 === "false" && (
                        <div>
                            <label htmlFor="q2_false" className="block text-sm font-medium text-gray-700 mb-1">
                                اگر خیر، دلیل خاصی دارد؟
                            </label>
                            <input
                                id="q2_false"
                                name="q2_false"
                                type="text"
                                className="w-full border-b-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-blue-600"
                                value={q2_false}
                                onChange={handleText("q2_false")}
                                placeholder="مثلا: در دسترس نبودن فروشگاه"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                        >
                            ثبت پاسخ‌ها
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
