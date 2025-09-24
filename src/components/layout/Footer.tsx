import type {FC} from "react";
import {RetailerLink} from "../ui/RetailerLink.tsx";
import {ArrowLeft, InstagramIcon, PhoneIcon} from "../ui/Icons.tsx";

export const Footer: FC = () => (
    <section className="flex flex-col bg-gray-100 w-full rounded-lg shadow-md overflow-hidden">
        {/* This div contains the retailer links */}
        <div className="w-full flex-grow flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-xs mx-auto space-y-3">
                <h2 className="text-xl text-brand-blue text-center font-bold">با خرید از فروشگاه‌های اکالا و اسنپ تخفیف
                    دریافت کنید.</h2>
                <RetailerLink imgSrc="/okala_logo.png" alt="Okala Logo" href="" borderColor="#E22533"/>
                <RetailerLink imgSrc="/snapp_express_logo.png" alt="Snapp! Express Logo" href="" borderColor="#FF9600"/>
                <RetailerLink imgSrc="/digikala_logo.png" alt="Digikala Logo" href="" borderColor="#ED1944"/>
                <h2 className="text-xl text-brand-blue text-center font-bold">به قید قرعه به مخاطبانی که ثبت نام کردن و
                    سوالات رو پاسخ دادن هدیه اهدا میشه.</h2>
            </div>
        </div>

        {/* The footer section with its distinct background and wave shape.
            `mt-16` is added here to create space between the retailer links section and this footer. */}
        <footer className="relative w-full text-white mt-16 concave-top">
            <div className="w-full flex-grow flex flex-col justify-center items-start pt-4 pb-4">
                <img src="/dove_footer_logo.png" alt="Dove Logo"
                     className="h-10 w-auto mb-4 mt-20 opacity-80 pr-8 pl-8"/>
                <div className="text-sm space-y-2 opacity-80 mt-4 pr-8 pl-8">
                    <p>دفتر مرکزی</p>
                    <p>تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳، پلاک ۲۳ کد پستی: ۱۵۱۶۶۸۳۱۱۱</p>
                </div>
                <div className="flex flex-col justify-center space-y-2 mt-12 space-x-reverse opacity-80 pr-8 pl-8">
                    <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                        <ArrowLeft/>
                        <span className="text-s px-2">خانه</span>
                    </a>
                    <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                        <ArrowLeft/>
                        <span className="text-s px-2">معرفی داو</span>
                    </a>
                    <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                        <PhoneIcon/>
                        <span className="text-s px-2">پشتیبانی</span>
                    </a>
                </div>
                <div className="mt-6 opacity-80 pr-8 pl-8">
                    <a href="/" className="flex items-center hover:opacity-100 opacity-100">
                        <InstagramIcon/>
                        <span className="text-s px-2">پشتیبانی</span>
                    </a>
                </div>
                <div className="mt-12 opacity-80 pr-6 pl-6">
                    <p className="text-xs">تمامی حقوق مادی و معنوی این وب سایت به گروه داو تعلق دارد . © 2025</p>
                </div>
            </div>
        </footer>
    </section>
);