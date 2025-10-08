import {useState, type FC} from "react";
import {RetailerLink} from "../ui/RetailerLink";
import {ArrowLeft, InstagramIcon, PhoneIcon} from "../ui/Icons";
import DiscountCodeModal from "../modal/DiscountCodeModal";
import type {RetailerId} from "../../types";

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
        logoSrc: "/okala_logo.png",
        accent: "#E22533",
        title: "کد تخفیف",
        description: "با وارد کردن این کد از تخفیف ویژه بهره‌مند شوید.",
        continueUrl: "",
    });

    const retailerMap: Partial<Record<RetailerId, RetailerCfg>> = {
        okala: {
            logoSrc: "/okala_logo.png",
            accent: "#E22533",
            code: "110605",
            title: "کد تخفیف",
            description:
                "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با ٪… تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://www.okala.com/offer/110605",
        },
        snapp: {
            logoSrc: "/snapp_express_logo.png",
            accent: "#FF9600",
            code: "qtrk",
            title: "کد تخفیف",
            description:
                "با استفاده از کد تخفیف زیر می‌توانید محصولات داو را با ٪… تخفیف ویژه تهیه کنید.\n" +
                "کافی‌ست کد را کپی کرده و از طریق لینک زیر خرید خود را انجام دهید",
            continueUrl: "https://d.snpx.link/qtrk",
        },
    };

    const openFor = (retailer: RetailerId) => {
        const cfg = retailerMap[retailer];
        if (!cfg) return;

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
    };

    return (
        <section className="flex flex-col w-full bg-gray-100">
            {/* Retailers section */}
            <div className="w-full flex-grow flex flex-col items-center p-8 md:p-16">
                <h2 className="text-xl md:text-2xl text-brand-blue text-center font-bold mb-12 md:mb-20">
                    با خرید از فروشگاه‌های اکالا و اسنپ تخفیف دریافت کنید.
                </h2>

                {/* Retailer Links - responsive grid */}
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
                    <RetailerLink
                        retailer="okala"
                        imgSrc="/okala_logo.png"
                        alt="Okala Logo"
                        href=""
                        borderColor="#E22533"
                        onActivate={openFor}
                        hasDiscount={true}
                    />

                    <RetailerLink
                        retailer="snapp"
                        imgSrc="/snapp_express_logo.png"
                        alt="Snapp! Express Logo"
                        href=""
                        borderColor="#FF9600"
                        onActivate={openFor}
                        hasDiscount={true}
                    />

                    <RetailerLink
                        retailer="digikala"
                        imgSrc="/digikala_logo.png"
                        alt="Digikala Logo"
                        href=""
                        borderColor="#ED1944"
                        onActivate={openFor}
                        hasDiscount={false}
                    />
                </div>
            </div>

            {/* Bottom Footer */}
            <footer className="relative w-full text-white bg-[#001F5F] mt-16">
                <img
                    src="/concave_top.svg"
                    alt="Footer curve"
                    className="h-auto w-full -mt-1"
                />

                <div
                    className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 px-6 md:px-12 pb-10 pt-20 items-center">
                    {/* Right Column */}
                    <div className="flex flex-col items-start">
                        <img
                            src="/dove_footer_logo.png"
                            alt="Dove Logo"
                            className="h-10 w-auto mb-4"
                        />
                        <div className="text-sm space-y-2">
                            <p className="text-xs pt-4">دفتر مرکزی</p>
                            <p className="text-xs py-4">
                                تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳، پلاک ۲۳ کد
                                پستی: ۱۵۱۶۶۸۳۱۱۱
                            </p>
                            <p className="text-xs pb-4">
                                تمامی حقوق مادی و معنوی این وب سایت به گروه داو تعلق دارد © 2025
                            </p>
                        </div>
                    </div>

                    {/* Left Nav */}
                    <div className="flex flex-col items-start">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <button
                                className="flex items-center"
                                onClick={() => scrollToSection("home-section")}
                            >
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

                            <a href="/" className="flex items-center">
                                <PhoneIcon/>
                                <span className="text-sm px-2">پشتیبانی</span>
                            </a>
                        </div>
                        <a
                            href="https://www.instagram.com/dove.iran?igsh=dXgwenp6OG1hcWt3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start pt-6"
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
                onContinue={() => setModal((s) => ({...s, open: false}))}
                continueUrl={modal.continueUrl}
            />
        </section>
    );
};