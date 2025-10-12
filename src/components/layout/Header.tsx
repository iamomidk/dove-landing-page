import {useState, type FC} from "react";
import {MenuIcon, CloseIcon, HeaderLogo} from "../ui/Icons";

const NAV_ITEMS = [
    {label: "خانه", action: () => scrollToSection("home-section")},
    {label: "معرفی داو", action: () => scrollToSection("intro-section")},
    {label: "پشتیبانی", href: "/"},
];

const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: "smooth"});
};

export const Header: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <HeaderLogo className="h-10 w-auto"/>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 py-2">
                    {NAV_ITEMS.map((item, idx) =>
                        item.href ? (
                            <a
                                key={idx}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="flex items-center text-2xl font-medium text-[#DAA156] hover:text-brand-blue transition-colors"
                            >
                                <span className="px-2">{item.label}</span>
                            </a>
                        ) : (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="flex items-center text-2xl font-medium text-[#DAA156] hover:text-brand-blue transition-colors"
                            >
                                <span className="px-2">{item.label}</span>
                            </button>
                        )
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#DAA156]"
                    onClick={() => setIsMenuOpen((p) => !p)}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? <CloseIcon/> : <MenuIcon/>}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 flex flex-col items-start gap-4 p-6">
                    {NAV_ITEMS.map((item, idx) =>
                        item.href ? (
                            <a
                                key={idx}
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="flex items-center text-sm font-medium text-[#DAA156]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span className="px-2">{item.label}</span>
                            </a>
                        ) : (
                            <button
                                key={idx}
                                onClick={() => {
                                    item.action?.();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center text-sm font-medium text-[#DAA156]"
                            >
                                <span className="px-2">{item.label}</span>
                            </button>
                        )
                    )}
                </div>
            )}
        </header>
    );
};