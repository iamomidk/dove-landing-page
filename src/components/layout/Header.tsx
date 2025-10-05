import {useEffect, useRef, useState, type FC} from "react";
import {MenuIcon, CloseIcon, HeaderLogo} from "../ui/Icons";

const NAV_ITEMS = [
    {href: "/", label: "خانه"},
    {href: "/", label: "محصولات"},
    {href: "/", label: "معرفی داو"},
    {href: "/", label: "پشتیبانی"},
];

export const MobileNav: FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    // Focus first link when opened
    useEffect(() => {
        if (isOpen) firstLinkRef.current?.focus();
    }, [isOpen]);

    // Lock background scroll while open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            id="mobile-nav"
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center text-center"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <h2 id="mobile-nav-title" className="sr-only">منوی ناوبری</h2>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-700"
                aria-label="بستن منو"
            >
                <CloseIcon className="w-8 h-8"/>
            </button>

            <nav className="flex flex-col space-y-8" aria-label="ناوبری اصلی">
                {NAV_ITEMS.map((item, idx) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="text-2xl text-brand-blue font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/50 rounded"
                        ref={idx === 0 ? firstLinkRef : undefined}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center bg-white shadow-sm"
                role="banner"
            >
                <a href="/" className="text-xl font-bold text-gray-800" aria-label="بازگشت به صفحه اصلی">
                    <HeaderLogo/>
                </a>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="text-brand-blue p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 rounded"
                    aria-label="باز کردن منو"
                    aria-haspopup="dialog"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-nav"
                >
                    <MenuIcon className="w-7 h-7"/>
                </button>
            </header>

            <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}/>
        </>
    );
};
