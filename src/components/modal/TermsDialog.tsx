import {type FC, useEffect, useRef} from "react";

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

type TermsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content: string;
};

export const TermsDialog: FC<TermsDialogProps> = ({
                                                      isOpen,
                                                      onClose,
                                                      title = "قوانین و مقررات",
                                                      content,
                                                  }) => {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            logEvent("terms_dialog_opened");
        } else {
            logEvent("terms_dialog_closed");
        }
    }, [isOpen]);

    // Prevent background scrolling
    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dialogRef}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white w-full max-w-lg mx-auto shadow-2xl overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-right">{title}</h2>
                </div>

                {/* Respect newlines + spaces and use RTL layout */}
                <div className="p-6 max-h-[60vh] overflow-y-auto text-brand-blue">
                    <div
                        dir="rtl"
                        lang="fa"
                        className="whitespace-pre-wrap break-words text-right leading-7"
                    >
                        <h1 className="text-2xl font-bold text-center mb-6">
                            قوانین و مقررات قرعه‌کشی محصولات داو
                        </h1>

                        <p className="mb-4">
                            با شرکت در قرعه‌کشی محصولات داو، شما با تمامی شرایط و قوانین زیر موافقت می‌نمایید.
                        </p>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">۱. شرایط کلی</h2>
                            <ul className="list-disc list-inside space-y-2 pr-4">
                                <li>این قرعه‌کشی به صورت آنلاین برگزار می‌شود و شرکت در آن برای عموم آزاد است.</li>
                                <li>قرعه‌کشی در پایان کمپین انجام می‌شود.</li>
                                <li>
                                    در انتها تعداد ۸ برنده از میان شرکت‌کنندگان، به قید قرعه، انتخاب خواهند شد که هر یک
                                    پک کامل محصولات داو و یک اتو موی حرفه‌ای دریافت خواهند کرد.
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">۲. نحوه شرکت در قرعه‌کشی</h2>
                            <ul className="list-disc list-inside space-y-2 pr-4">
                                <li>برای شرکت در جشنواره، کافی است بعد از احراز هویت وارد بخش پاسخ به سوالات شوید.</li>
                                <li>
                                    صرفاً صاحب خط تلفن همراهی که کد تایید را دریافت و ارسال می‌کند، به عنوان برنده
                                    شناخته خواهد شد.
                                </li>
                                <li>هر شماره تلفن همراه فقط یک‌بار قابلیت شرکت در قرعه‌کشی را دارد.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">۳. شرایط احراز هویت و دریافت هدایا</h2>
                            <ul className="list-disc list-inside space-y-2 pr-4">
                                <li>
                                    برای دریافت جایزه، ارائه مدارک شناسایی معتبر (شامل کارت ملی و مستندات مالکیت خط)
                                    الزامی است.
                                </li>
                                <li>
                                    جایزه فقط به خود شخص برنده (صاحب خط ارسال‌کننده کد که مدارک هویتی معتبر ارائه داده
                                    است) تحویل داده خواهد شد.
                                </li>
                                <li>نتایج جشنواره از طریق رسانه‌های رسمی برند داو اطلاع‌رسانی خواهد شد.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={() => {
                            logEvent("terms_dialog_closed_button");
                            onClose();
                        }}
                        className="px-4 py-2 bg-brand-blue text-white font-bold hover:bg-blue-800 transition"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsDialog;
