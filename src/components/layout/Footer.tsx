import { useState, type FC } from "react";
import { RetailerLink } from "../ui/RetailerLink";
import { ArrowLeft, InstagramIcon, PhoneIcon } from "../ui/Icons";
import DiscountCodeModal from "../modal/DiscountCodeModal";
import type { RetailerId } from "../../types"; // <- ensures prop types align with RetailerLink

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

    // ✅ Single, explicitly typed map that can be indexed by any RetailerId
    const retailerMap: Partial<Record<RetailerId, RetailerCfg>> = {
        okala: {
            logoSrc: "/okala_logo.png",
            accent: "#E22533",
            code: "110605",
            title: "کد تخفیف",
            description:
                "با وارد کردن لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز می باشد.",
            continueUrl: "https://www.okala.com/offer/110605",
        },
        snapp: {
            logoSrc: "/snapp_express_logo.png",
            accent: "#FF9600",
            code: "qtrk",
            title: "کد تخفیف",
            description:
                "با وارد کردن لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز می باشد.",
            continueUrl: "https://d.snpx.link/qtrk",
        },
        // digikala: { ... } // add later when ready
    };

    const openFor = (retailer: RetailerId) => {
        const cfg = retailerMap[retailer];

        if (!cfg) {
            // Fallback for unsupported retailers (e.g., digikala for now)
            setModal({
                open: true,
                code: "",
                logoSrc: "/digikala_logo.png",
                accent: "#ED1944",
                title: "به‌زودی",
                description: "کد تخفیف این فروشگاه به زودی اضافه می‌شود.",
                continueUrl: "",
            });
            return;
        }

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

    return (
        <section className="flex flex-col bg-gray-100 w-full rounded-lg shadow-md overflow-hidden">
            {/* Retailers column */}
            <div className="w-full flex-grow flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-xs mx-auto space-y-4">
                    <h2 className="text-xl text-brand-blue text-center font-bold mb-16">
                        با خرید از فروشگاه‌های اکالا و اسنپ تخفیف دریافت کنید.
                    </h2>

                    <RetailerLink
                        retailer="okala"
                        imgSrc="/okala_logo.png"
                        alt="Okala Logo"
                        href="" // keep empty to use <button>; set URL to use <a>
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

                        {/* Bottom footer content */}
            <footer className="relative w-full text-white brand-blue mt-16">
                <img
                    src="/concave_top.svg"
                    alt="Dove Logo"
                    className="h-auto w-full top-0"
                />
                <div className="flex-grow flex flex-col justify-center items-start pt-4 pb-4">
                    <img
                        src="/dove_footer_logo.png"
                        alt="Dove Logo"
                        className="h-10 w-auto mb-4 mt-20 opacity-80 pr-8 pl-8"
                    />
                    <div className="text-sm space-y-2 opacity-80 mt-4 pr-8 pl-8">
                        <p>دفتر مرکزی</p>
                        <p>تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳، پلاک ۲۳ کد پستی: ۱۵۱۶۶۸۳۱۱۱</p>
                    </div>
                    <div className="flex flex-col justify-center space-y-2 mt-12 space-x-reverse opacity-80 pr-8 pl-8">
                        <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                            <ArrowLeft />
                            <span className="text-s px-2">خانه</span>
                        </a>
                        <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                            <ArrowLeft />
                            <span className="text-s px-2">معرفی داو</span>
                        </a>
                        <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                            <PhoneIcon />
                            <span className="text-s px-2">پشتیبانی</span>
                        </a>
                    </div>
                    <div className="mt-6 opacity-80 pr-8 pl-8">
                        <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                            <InstagramIcon />
                            <span className="text-s px-2">اینستاگرام</span>
                        </a>
                    </div>
                    <div className="mt-12 opacity-80 pr-6 pl-6">
                        <p className="text-xs">تمامی حقوق مادی و معنوی این وب سایت به گروه داو تعلق دارد . © 2025</p>
                    </div>
                </div>
            </footer>

            {/* Modal */}
            <DiscountCodeModal
                isOpen={modal.open}
                onClose={() => setModal((s) => ({ ...s, open: false }))}
                code={modal.code}
                logoSrc={modal.logoSrc}
                accentTopColor={modal.accent}
                title={modal.title}
                description={modal.description}
                onContinue={() => setModal((s) => ({ ...s, open: false }))}
                continueUrl={modal.continueUrl}
            />
        </section>
    );
};
