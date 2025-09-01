import { useState, type FC } from "react";
import { MenuIcon, CloseIcon, HeaderLogo } from "../ui/Icons.tsx";

export const MobileNav: FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center text-center" dir="rtl">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-700">
                <CloseIcon className="w-8 h-8"/>
            </button>
            <nav className="flex flex-col space-y-8">
                <a href="/" onClick={onClose} className="text-2xl text-brand-blue font-bold">خانه</a>
                <a href="/" onClick={onClose} className="text-2xl text-brand-blue font-bold">محصولات</a>
                <a href="/" onClick={onClose} className="text-2xl text-brand-blue font-bold">معرفی داو</a>
                <a href="/" onClick={onClose} className="text-2xl text-brand-blue font-bold">پشتیبانی</a>
            </nav>
        </div>
    );
};

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center bg-white shadow-sm">
                <a href="/" className="text-xl font-bold text-gray-800">
                    <HeaderLogo/>
                </a>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="text-brand-blue p-2"
                    aria-label="Open menu"
                >
                    <MenuIcon className="w-7 h-7"/>
                </button>
            </header>
            <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}/>
        </>
    );
};
