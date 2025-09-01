import type {FC} from "react";
import {RetailerLink} from "../ui/RetailerLink.tsx";
import {HomeIcon, InfoIcon, PhoneIcon} from "../ui/Icons.tsx";

export const Footer: FC = () => (
    <section className="flex flex-col bg-white">
        <div className="w-full flex-grow flex flex-col justify-center items-center p-8">
            <div className="w-full max-w-xs mx-auto space-y-3">
                <RetailerLink imgSrc="https://placehold.co/120x40/ffffff/cc0000?text=اکالا" alt="Okala Logo"/>
                <RetailerLink imgSrc="https://placehold.co/120x40/ffffff/ffcc00?text=Snapp!" alt="Snapp! Express Logo"/>
                <RetailerLink imgSrc="https://placehold.co/120x40/ffffff/ef4056?text=دیجی‌کالا" alt="Digikala Logo"/>
            </div>
        </div>
        <footer className="relative w-full brand-blue text-white text-center ">
            <div className="absolute w-full overflow-hidden leading-[0] " style={{transform: 'translateY(-99%)'}}>
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[55px]">
                    <path d="M600,0 C1200,0 1200,120 1200,120 L0,120 C0,120 0,0 600,0 Z" className="fill-brand-blue"/>
                </svg>
            </div>
            <div className="w-full flex-grow flex flex-col justify-center p-4 pt-12">
                <img src="https://placehold.co/100x40/003366/ffffff?text=Dove" alt="Dove Logo" className="mx-auto"/>
                <div className="text-sm space-y-2 opacity-80 mt-4">
                    <p>دفتر مرکزی</p>
                    <p>تهران، میدان آرژانتین، خیابان زاگرس، نبش خیابان ۳۳</p>
                </div>
                <div className="flex justify-center space-x-8 space-x-reverse pt-6 mt-6 opacity-80">
                    <a href="/"
                       className="flex flex-col items-center space-y-1 hover:opacity-100 opacity-80"><HomeIcon/> <span
                        className="text-xs">خانه</span></a>
                    <a href="/"
                       className="flex flex-col items-center space-y-1 hover:opacity-100 opacity-80"><InfoIcon/> <span
                        className="text-xs">معرفی داو</span></a>
                    <a href="/"
                       className="flex flex-col items-center space-y-1 hover:opacity-100 opacity-80"><PhoneIcon/> <span
                        className="text-xs">پشتیبانی</span></a>
                </div>
                <div className="mt-6 opacity-80">
                    <p className="text-xs">ما را در شبکه های اجتماعی دنبال کنید.</p>
                </div>
            </div>
        </footer>
    </section>
);
