import type {FC, JSX} from "react";
import {RetailerLink} from "../ui/RetailerLink.tsx";
import {ArrowLeft, InstagramIcon, PhoneIcon} from "../ui/Icons.tsx";

type NavItem = { href: string; label: string; icon?: "arrow" | "phone" };
type SocialItem = { href: string; label: string; icon: "instagram" };

const STORE_LINKS = [
    {imgSrc: "/okala_logo.png", alt: "Okala Logo", href: "", borderColor: "#E22533"},
    {imgSrc: "/snapp_express_logo.png", alt: "Snapp! Express Logo", href: "", borderColor: "#FF9600"},
    {imgSrc: "/digikala_logo.png", alt: "Digikala Logo", href: "", borderColor: "#ED1944"},
] as const;

const NAV_LINKS: NavItem[] = [
    {href: "/", label: "خانه", icon: "arrow"},
    {href: "/", label: "معرفی داو", icon: "arrow"},
    {href: "/", label: "پشتیبانی", icon: "phone"},
];

const SOCIAL_LINKS: SocialItem[] = [
    {href: "/", label: "اینستاگرام", icon: "instagram"},
];

export const Footer: FC = () => (
    <section className="flex flex-col bg-gray-100 w-full  shadow-md overflow-hidden" role="region"
             aria-labelledby="retailers-title">
        {/* Retailers */}
        <div className="w-full flex-grow flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-xs mx-auto space-y-3">
                <h2 id="retailers-title" className="text-xl text-brand-blue text-center font-bold">
                    با خرید از فروشگاه‌های اکالا و اسنپ تخفیف دریافت کنید.
                </h2>

                {STORE_LINKS.map((store) => (
                    <RetailerLink
                        key={store.alt}
                        imgSrc={store.imgSrc}
                        alt={store.alt}
                        href={store.href}
                        borderColor={store.borderColor}
                    />
                ))}

                <h2 className="text-xl text-brand-blue text-center font-bold">
                    به قید قرعه به مخاطبانی که ثبت نام کردن و سوالات رو پاسخ دادن هدیه اهدا میشه.
                </h2>
            </div>
        </div>

        {/* Footer */}
        <footer className="relative w-full text-white mt-16 concave-top" role="contentinfo">
            <div className="w-full flex-grow flex flex-col justify-center items-start pt-4 pb-4">
                <img
                    src="/dove_footer_logo.png"
                    alt="Dove Logo"
                    className="h-10 w-auto mb-4 mt-20 opacity-80 pr-8 pl-8"
                    loading="lazy"
                />

                {/* Address */}
                <address className="not-italic text-sm space-y-2 opacity-80 mt-4 pr-8 pl-8"
                         aria-label="آدرس دفتر مرکزی">
                    <p>دفتر مرکزی</p>
                    <p>تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳، پلاک ۲۳ کد پستی: ۱۵۱۶۶۸۳۱۱۱</p>
                </address>

                {/* Nav */}
                <nav className="mt-12 pr-8 pl-8" aria-label="ناوبری پاورقی">
                    <ul className="flex flex-col justify-center space-y-2 opacity-80 space-x-reverse">
                        {NAV_LINKS.map(({href, label, icon}) => (
                            <li key={label}>
                                <a href={href} className="flex items-center hover:opacity-100 opacity-100">
                                    {icon === "arrow" && <ArrowLeft className="h-6 w-6"/>}
                                    {icon === "phone" && <PhoneIcon className="h-6 w-6"/>}
                                    <span className="text-s px-2">{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Social */}
                <div className="mt-6 opacity-80 pr-8 pl-8">
                    <ul className="flex flex-col space-y-2" aria-label="شبکه‌های اجتماعی">
                        {SOCIAL_LINKS.map(({href, label, icon}) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    className="flex items-center hover:opacity-100 opacity-100"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                >
                                    {icon === "instagram" && <InstagramIcon className="h-6 w-6"/>}
                                    <span className="text-s px-2">{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div className="mt-12 opacity-80 pr-6 pl-6">
                    <p className="text-xs">
                        تمامی حقوق مادی و معنوی این وب‌سایت به گروه داو تعلق دارد. © 2025
                    </p>
                </div>
            </div>
        </footer>
    </section>
);
