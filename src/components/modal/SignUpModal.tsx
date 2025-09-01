import {useState, type FC, type FormEvent, useEffect, type ChangeEvent} from 'react';
import {type SignUpModalProps} from "../../types";

const ModalHeader: FC<{ onBack: () => void; title: string; subtitle: string }> = ({onBack, title, subtitle}) => (
    <>
        <div
            className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue text-center flex-grow">{title}</h2>
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center">
                بازگشت
            </button>
        </div>
        <p className="text-gray-500 text-sm text-center mb-6">{subtitle}</p>
    </>
);

const SignUpModal: FC<SignUpModalProps> = ({isOpen, onClose}) => {
    const [modalStep, setModalStep] = useState<number>(1);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(115);

    useEffect(() => {
        let interval: number | undefined;
        if (isOpen && timer > 0) {
            interval = window.setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isOpen, timer]);

    useEffect(() => {
        if (isOpen) {
            setModalStep(1);
            setTermsAccepted(false);
            setTimer(115);
        }
    }, [isOpen]);

    const handleInfoSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalStep(2);
    };
    const handleGoBackToStep1 = () => setModalStep(1);
    const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
             onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto"
                 onClick={(e) => e.stopPropagation()}>
                {modalStep === 1 ? (
                    <div className="p-6">
                        <ModalHeader
                            onBack={onClose}
                            title="خوش آمدید!"
                            subtitle="لطفا شماره موبایل و نام و نام خانوادگی خود را وارد کنید."
                        />
                        <form onSubmit={handleInfoSubmit}>
                            <input type="text" placeholder="نام و نام خانوادگی"
                                   className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   required/>
                            <input type="tel" placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                                   className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   required/>
                            <div className="flex items-center my-6">
                                <p className="text-sm text-gray-500 ml-auto">{formatTime(timer)}</p>
                                <input type="checkbox" id="terms" checked={termsAccepted}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setTermsAccepted(e.target.checked)}
                                       className="ml-2"/>
                                <label htmlFor="terms" className="text-xs text-gray-700">
                                    <a href="/" className="text-blue-600 hover:underline">قوانین و شرایط</a> را مطالعه
                                    کردم و با آن موافقم.
                                </label>
                            </div>
                            <button type="submit"
                                    className="brand-blue text-white font-bold py-3 rounded-lg w-full transition-opacity disabled:opacity-50"
                                    disabled={!termsAccepted}>ارسال
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <ModalHeader
                            onBack={handleGoBackToStep1}
                            title="کد تایید"
                            subtitle="لطفا کد ۴ رقمی ارسال شده به شماره ۰۹۱۲۳۴۵۶۷۸۹ را وارد نمایید!"
                        />
                        <form>
                            <input type="text" placeholder="کد تایید"
                                   className="otp-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   maxLength={4} required/>
                            <div className="flex justify-between items-center my-6">
                                <p className="text-sm text-gray-500">{formatTime(timer)}</p>
                                <a href="/" onClick={(e) => {
                                    e.preventDefault();
                                    handleGoBackToStep1();
                                }} className="text-xs text-blue-600 hover:underline">شماره موبایل اشتباه است؟</a>
                            </div>
                            <button type="submit"
                                    className="brand-blue text-white font-bold py-3 rounded-lg w-full">نمایش سوالات
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpModal;