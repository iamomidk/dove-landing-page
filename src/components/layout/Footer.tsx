import {useState, type FC} from "react";
import {RetailerLink} from "../ui/RetailerLink";
import {ArrowLeft, InstagramIcon, PhoneIcon} from "../ui/Icons";
import DiscountCodeModal from "../modal/DiscountCodeModal";
import type {RetailerId} from "../../types";
import {trackEvent} from "../../analytics";

type ModalState = {
    open: boolean;
    code: string;
    logoSrc: string;
    accent: string;
    title: string;
    description: string;
    continueUrl: string;
};

type RetailerCfg = {
    logoSrc: string;
    accent: string;
    code: string;
    title: string;
    description: string;
    continueUrl: string;
};

export const Footer: FC = () => {
    const [modal, setModal] = useState<ModalState>({
        open: false,
        code: "",
        logoSrc: "/okala_logo.webp",
        accent: "#E22533",
        title: "کد تخفیف",
        description: "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.",
        continueUrl: "",
    });

    const retailerMap: Partial<Record<RetailerId, RetailerCfg>> = {
        okala: {
            logoSrc: "/okala_logo.webp",
            accent: "#E22533",
            code: "KGQB",
            title: "کد تخفیف",
            description:
                "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://www.okala.com/offer/110605",
        },
        snapp: {
            logoSrc: "/snapp_express_logo.webp",
            accent: "#FF9600",
            code: "vipcode25",
            title: "کد تخفیف",
            description:
                "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با ۱۵٪ تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://d.snpx.link/qtrk",
        },
    };

    const openFor = (retailer: RetailerId) => {
        const cfg = retailerMap[retailer];
        if (!cfg) return;

        // 🔹 Track GA event
        trackEvent("open_discount_modal", "Retailer", retailer);

        setModal({
            open: true,
            code: cfg.code,
            logoSrc: cfg.logoSrc,
            accent: cfg.accent,
            title: cfg.title,
            description: cfg.description,
            continueUrl: cfg.continueUrl,
        });
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior: "smooth"});

        // 🔹 Track GA event
        trackEvent("scroll_to_section", "Navigation", id);
    };

    const handleInstagramClick = () => {
        trackEvent("instagram_click", "Social", "Footer Instagram Link");
    };

    const handlePhoneClick = (number: string) => {
        trackEvent("phone_click", "Support", number);
    };

    const handleContinueClick = () => {
        trackEvent("continue_to_retailer", "Retailer", modal.continueUrl);
        setModal((s) => ({...s, open: false}));
    };

    return (
        <section className="flex flex-col w-full bg-gray-100">
            {/* Retailers section */}
            <div className="w-full flex-grow flex flex-col items-center p-8 md:p-16 justify-center content-center">
                <h2 className="text-xl md:text-2xl text-brand-blue text-center font-bold mb-12 md:mb-20">
                    با خرید از فروشگاه‌های اکالا و اسنپ تخفیف دریافت کنید.
                </h2>

                {/* Retailer Links */}
                <div
                    className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center justify-center"
                >
                    <RetailerLink
                        retailer="okala"
                        imgSrc="/okala_logo.webp"
                        alt="Okala Logo"
                        href=""
                        borderColor="#E22533"
                        onActivate={openFor}
                        hasDiscount={true}
                    />
                    <RetailerLink
                        retailer="snapp"
                        imgSrc="/snapp_express_logo.webp"
                        alt="Snapp! Express Logo"
                        href=""
                        borderColor="#FF9600"
                        onActivate={openFor}
                        hasDiscount={true}
                    />
                    <RetailerLink
                        retailer="digikala"
                        imgSrc="/digikala_logo.webp"
                        alt="Digikala Logo"
                        href="https://www.digikala.com/product-list/plp_340034663/"
                        borderColor="#ED1944"
                        onActivate={() => {
                            trackEvent("digikala_click", "Retailer", "Digikala");
                            window.open("https://www.digikala.com/product-list/plp_340034663/", "_blank", "noopener,noreferrer");
                        }}
                        hasDiscount={false}
                    />
                </div>
            </div>

            {/* Bottom Footer */}
            <footer className="relative w-full text-white bg-[#001F5F] mt-16">
                <img src="/concave_top.svg" alt="Footer curve" className="h-auto w-full -mt-1"/>

                <div
                    className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 px-6 md:px-12 pb-10 pt-20 items-center">
                    {/* Right Column */}
                    <div className="flex flex-col items-start">
                        <img src="/Footer.svg" alt="Dove Logo" className="h-16 w-auto mb-4"/>
                        <div className="text-sm space-y-2">
                            <p className="text-base pt-4">دفتر مرکزی</p>
                            <p className="text-sm py-4">
                                تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳، پلاک ۲۳ کد پستی: ۱۵۱۶۶۸۳۱۱۱
                            </p>
                            <p className="text-sm pb-4">
                                تمامی حقوق مادی و معنوی این وب سایت به گروه داو تعلق دارد © 2025
                            </p>
                        </div>
                    </div>

                    {/* Left Nav */}
                    <div className="flex flex-col items-start">
                        <div className="flex flex-col md:flex-row items-start gap-6 mt-32">
                            <button className="flex items-center" onClick={() => scrollToSection("home-section")}>
                                <ArrowLeft/>
                                <span className="text-sm px-2">خانه</span>
                            </button>

                            <button
                                className="flex items-center"
                                onClick={() => scrollToSection("intro-section")}
                            >
                                <ArrowLeft/>
                                <span className="text-sm px-2">معرفی داو</span>
                            </button>

                            <div className="flex text-sm">
                                <div className="flex items-center mb-1">
                                    <PhoneIcon/>
                                    <span className="px-2">پشتیبانی</span>
                                </div>

                                <a
                                    dir="ltr"
                                    href="tel:02126216403"
                                    className="pl-8 hover:underline"
                                    onClick={() => handlePhoneClick("02126216403")}
                                >
                                    ۰۲۱ ۲۶۲۱ ۶۴۰۳
                                </a>

                                <a
                                    dir="ltr"
                                    href="tel:02126217005"
                                    className="pl-8 hover:underline"
                                    onClick={() => handlePhoneClick("02126217005")}
                                >
                                    ۰۲۱ ۲۶۲۱ ۷۰۰۵
                                </a>
                            </div>
                        </div>

                        <a
                            href="https://www.instagram.com/dove.iran?igsh=dXgwenp6OG1hcWt3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start pt-6"
                            onClick={handleInstagramClick}
                        >
                            <InstagramIcon/>
                            <span className="text-sm px-2">ما را در شبکه‌های اجتماعی دنبال کنید.</span>
                        </a>
                    </div>
                </div>
            </footer>

            <DiscountCodeModal
                isOpen={modal.open}
                onClose={() => setModal((s) => ({...s, open: false}))}
                code={modal.code}
                logoSrc={modal.logoSrc}
                accentTopColor={modal.accent}
                title={modal.title}
                description={modal.description}
                onContinue={handleContinueClick}
                continueUrl={modal.continueUrl}
            />
        </section>
    );
};