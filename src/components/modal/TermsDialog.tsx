import {type FC, useEffect, useRef} from "react";

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
                <div className="p-6 max-h-[60vh] overflow-y-auto text-gray-700">
                    <div
                        dir="rtl"
                        lang="fa"
                        className="whitespace-pre-wrap break-words text-right leading-7"
                    >
                        {content}
                    </div>
                </div>

                <div className="px-6 py-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
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
