import type {FC} from "react";
import {useLocation, Navigate, useNavigate} from "react-router-dom";
import {useState} from "react";

// 👇 change this to whatever secret key you encoded in the QR
const REQUIRED_KEY = "hse-qr-2025";

type HseSection = {
    id: string;
    title: string;
    bullets: string[];
    icon: string; // just an emoji for now
    images: string[];
};

// All sections taken from the Excel file you sent
const HSE_SECTIONS: HseSection[] = [
    {
        id: "earthquake",
        title: "در صورت وقوع زلزله",
        icon: "🌎",
        bullets: [
            "در جای خود بمانید و از سازه‌ها و شیشه‌ها فاصله بگیرید.",
            "روی زمین بنشینید و با دست یا کیف خود از سر و گردن محافظت کنید.",
            "پس از پایان لرزش، از درب خروج اضطراری (درب‌های ۳ سالن در تصویر مشخص است) خارج شوید.*",
            "به سمت محل تجمع ایمن هدایت شوید و در آنجا باقی بمانید.**",
            "منتظر بمانید تا تیم اجرایی اسامی شما را ثبت کند.",
            "لطفاً به سالن بازنگردید و مجموعه را ترک نکنید تا اطلاع بعدی.",
            "در صورت بروز حادثه، حتماً به مسئول اجرایی اطلاع دهید."
        ],
        images: ["/earthquake_1.jpeg", "/earthquake_2.jpeg", "/earthquake_3.jpeg", "/earthquake_4.png"]
    },
    {
        id: "fire",
        title: "در صورت مشاهده یا وقوع حریق",
        icon: "🔥",
        bullets: [
            "آژیر خطر به صدا درمی‌آید و فلاشر هشداردهنده فعال می‌شود.",
            "ممکن است قبل از فعال شدن آژیر، خودتان حریق را مشاهده کنید:",
            "در این صورت، به مسئول اجرایی اطلاع دهید یا",
            "شستی قرمز رنگ اعلام حریق را فشار دهید.*",
            "هرگز به سمت آتش نروید.",
            "اجازه دهید پرسنل آموزش‌دیده یا آتش‌نشانان عملیات اطفا را انجام دهند.",
            "در صورت وجود دود، چهار دست و پا حرکت کنید و بینی و دهان خود را بپوشانید.",
            "از درب خروج اضطراری خارج شوید و به محل تجمع ایمن بروید."
        ],
        images: ["/fire.png"]
    },
    {
        id: "unsafe",
        title: "در صورت مشاهده شرایط ناایمن",
        icon: "⚠️",
        bullets: [
            "لطفاً موضوع را به مسئول اجرایی مجموعه اطلاع دهید."
        ],
        images: []
    },
    {
        id: "stairs-elevator",
        title: "هنگام استفاده از پله‌ها و آسانسور",
        icon: "⬆️",
        bullets: [
            "در هنگام بالا یا پایین رفتن از پله‌ها، حتماً نرده‌ها را بگیرید.*",
            "در استفاده از آسانسور به ظرفیت مجاز توجه کنید و از اوورلود شدن جلوگیری نمایید.",
            "هرگز با دست جلوی بسته شدن درب آسانسور را نگیرید.",
            "در صورت نیاز، از دکمه‌های داخل یا بیرون آسانسور برای باز نگه داشتن درب استفاده کنید."
        ],
        images: ["/stairs_elevator.png"]
    },
    {
        id: "smoking",
        title: "محل‌های مجاز برای سیگار کشیدن",
        icon: "🚬",
        bullets: [
            "مقابل رستوران*",
            "مقابل سالن ایرانی**"
        ],
        images: ["/smoking_1.png", "/smoking_2.png"]
    },
    {
        id: "supervisor",
        title: "مسئول اجرایی",
        icon: "🧑‍💼",
        bullets: [
            "در صورت مشاهده حادثه یا شرایط ناایمن، سریعاً به مسئول اجرایی اطلاع دهید.",
            "محل دقیق وقوع حادثه را اعلام کرده و تا رسیدن کمک در کنار افراد نیازمند بمانید."
        ],
        images: ["/supervisor.jpeg"]
    }
];

export const HsePage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const key = params.get("k");

    // ❌ QR guard
    if (key !== REQUIRED_KEY) {
        return <Navigate to="/" replace/>;
    }

    const [activeId, setActiveId] = useState<string>("earthquake");
    const activeSection =
        HSE_SECTIONS.find((section) => section.id === activeId) ?? HSE_SECTIONS[0];

    return (
        <div dir="rtl" className="w-full min-h-screen bg-white flex flex-col items-center">
            {/* ==== BLUE HEADER / CONTENT AREA ==== */}
            <section className="w-full bg-[#1F3A75] pl-6 pt-10 pb-8 flex flex-col items-center text-white">
                {/* Dove logo – replace with local asset if you have one */}

                <h1 className="text-white text-xl font-bold justify-center">راهنمای ایمنی برای مهمانان گرامی</h1>

                <img
                    src="/hse_header.png"
                    alt="Dove Logo"
                    className="w-auto h-16 my-8"
                />

                <div className="w-full flex">
                    {/* ICON BAR WITH WHITE BACKGROUND */}
                    <div
                        className="bg-white p-2 flex flex-col gap-3 items-center justify-center border border-white/40">
                        {HSE_SECTIONS.map((section) => {
                            const isActive = section.id === activeSection.id;
                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => setActiveId(section.id)}
                                    className={
                                        `w-12 h-12 flex items-center justify-center rounded-full border transition
                                            ${isActive ? "bg-[#1F3A75] border-[#1F3A75] text-white"
                                            : "bg-white border-[#1F3A75]/40 text-[#1F3A75]"
                                        }
                                        `}
                                    aria-label={section.title}>
                                    <span className="text-xl">{section.icon}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* MAIN TEXT AREA */}
                    <div className="flex-1 text-justify mx-8">
                        <h2 className="text-base font-bold mb-4">
                            {activeSection.title}
                        </h2>

                        <ul className="space-y-2n text-sm">
                            {activeSection.bullets.map((line, idx) => (
                                <li key={idx}>• {line}</li>
                            ))}
                        </ul>
                    </div>

                </div>
            </section>

            {/* ==== PHOTOS SECTION ==== */}
            <section
                className="w-full max-w-3xl px-6 py-10 grid gap-6 grid-cols-2"
                aria-label={activeSection.title ? `تصاویر مربوط به ${activeSection.title}` : "گالری تصاویر"}
            >
                {activeSection.images.map((image, pos) => {
                    const total = activeSection.images.length;

                    const renderStars = () => {
                        // Single image → one golden star
                        if (total === 1) {
                            return (
                                <>
                                    <span className="text-xs text-[#C8A55B]">✱</span>
                                </>
                            );
                        }
                        if (total === 4) {
                            if (pos === 3) {
                                // second image → gray + gold
                                return (
                                    <>
                                        <span className="text-xs text-[#C8A55B]">✱</span>
                                        <span className="text-xs text-[#C8A55B]">✱</span>
                                    </>
                                );
                            }

                            return (
                                <>
                                    <span className="text-xs text-[#D9D9D9]">✱</span>
                                    <span className="text-xs text-[#C8A55B]">✱</span>
                                </>
                            );
                        }

                        // Multiple images
                        if (pos === 1) {
                            // second image → gray + gold
                            return (
                                <>
                                    <span className="text-xs text-[#D9D9D9]">✱</span>
                                    <span className="text-xs text-[#C8A55B]">✱</span>
                                </>
                            );
                        }

                        // others → two gold
                        return (
                            <>
                                <span className="text-xs text-[#C8A55B]">✱</span>
                                <span className="text-xs text-[#C8A55B]">✱</span>
                            </>
                        );
                    };

                    return (
                        <figure
                            key={image || pos}
                            className="relative w-full overflow-hidden border border-gray-100 bg-white shadow-sm"
                        >
                            <img
                                src={image}
                                className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                                alt={
                                    activeSection.title
                                        ? `تصویر ${pos + 1} از ${activeSection.title}`
                                        : `تصویر ${pos + 1}`
                                }
                                loading="lazy"
                            />

                            {/* star indicator */}
                            <figcaption
                                className="absolute bottom-2 left-0 bg-white/90 px-3 py-1 shadow-sm"
                            >
                    <span
                        className="flex gap-1 justify-center items-center"
                        aria-hidden="true"
                    >
                        {renderStars()}
                    </span>
                                {/* screen-reader text if you want a description for the indicator */}
                                <span className="sr-only">
                        {/* you can customize this text */}
                                    تصویر {pos + 1} از {total}
                    </span>
                            </figcaption>
                        </figure>
                    );
                })}
            </section>

            {/* ==== FOOTER TEXT ==== */}
            {/*<button
                onClick={() => navigate("/")}
                className="text-[#1F3A75] text-base font-semibold pb-10 underline"
            >صفحه اصلی
            </button>*/}
        </div>
    );
};
