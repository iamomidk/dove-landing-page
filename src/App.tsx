import {useState, useEffect, type FC, type FormEvent, type ChangeEvent} from 'react';
// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBpGyvxqzzxiuTCNUf6-FNTpdPxOu6FGwM",
    authDomain: "dove-landing-page.firebaseapp.com",
    projectId: "dove-landing-page",
    storageBucket: "dove-landing-page.firebasestorage.app",
    messagingSenderId: "126935094079",
    appId: "1:126935094079:web:8e95179ed6b3ec6e74b98a",
    measurementId: "G-Z6EYH1TRB7"
};

// Initialize Firebase safely to prevent re-initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

// --- Type Definitions ---
interface Product {
    imgSrc: string;
    title: string;
    description: string;
}

// --- Prop Types for Components ---
interface ProductSectionProps {
    products: Product[];
}

interface ProductCardProps {
    product: Product;
}

interface CtaSectionProps {
    onOpenModal: () => void;
}

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RetailerLinkProps {
    imgSrc: string;
    alt: string;
}

interface IconProps {
    className?: string;
}

// --- Static Data ---
const products: Product[] = [
    {
        imgSrc: "/narmkonandeh_1.png",
        title: "شامپو و نرم کننده",
        description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ"
    },
    {
        imgSrc: "/narmkonandeh_2.png",
        title: "شامپو مراقبت روزانه",
        description: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ"
    },
    {imgSrc: "/narmkonandeh_3.png", title: "روغن مو آرگان", description: "تغذیه کننده عمیق برای موهای درخشان و نرم."},
    {imgSrc: "/narmkonandeh_4.png", title: "ماسک مو ترمیم کننده", description: "بازسازی کننده ساختار موهای آسیب دیده."},
    {imgSrc: "/narmkonandeh_5.png", title: "ماسک مو ترمیم کننده", description: "بازسازی کننده ساختار موهای آسیب دیده."},
];

// --- Global Styles Component ---
const GlobalStyles: FC = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;800&display=swap');
        
        /* Base body styles */
        body { 
            font-family: 'Vazirmatn', sans-serif; 
            background-color: #f8f9fa; 
            direction: rtl; 
        }

        /* Hide scrollbars for a cleaner look */
        body {
            -ms-overflow-style: none; 
            scrollbar-width: none;
        }
        body::-webkit-scrollbar { 
            display: none; 
        }

        /* Wrapper for the sticky sections */
        .sticky-wrapper {
            height: 300vh; /* Set height to 100vh * number of sticky sections */
            position: relative;
        }

        /* Sticky Panel Effect (Applied only to sections that need it) */
        .scroll-section { 
            height: 100vh; 
            width: 100%; 
            position: sticky;
            top: 0;
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
        }
        
        /* CHANGED: Removed max-height and overflow to disable inner scroll */
        .product-list-scroll { 
            width: 100%; 
        }
        
        /* Responsive Video Container Styles */
        .video-responsive-container {
            position: relative;
            overflow: hidden;
            width: 100%;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
        }
        .video-responsive-iframe {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }

        /* New Product Card Styles */
        .list-card-item {
            text-align: right;
            overflow: hidden; /* To contain the border-radius on the image */
            display: flex;
            flex-direction: column;
        }
        .card-item--image .cmp-image__image {
            width: 100%;
            height: 10%; /* 192px */
            object-fit: contain;
            padding-top: 1rem;
            padding-left: 4rem;
            padding-right: 4rem;
        }
        .card-item--details {
            padding-top: 1rem;
            padding-left: 4rem;
            padding-right: 4rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .card-item--details .title {
            margin-bottom: 0.5rem;
        }
        .card-item--details .card-title {
            font-size: 1.125rem; /* 18px */
            font-weight: 700;
            color: #4a5568; /* Tailwind gray-600 */
        }
        .card-item--details .card-sub-title {
            font-size: 1.125rem; /* 18px */
            font-weight: 700;
            color: #001F5F; /* Tailwind gray-600 */
        }
        .card-item--details a {
            text-decoration: none;
        }
        .card-tags {
            margin-top: auto; /* Pushes the tag to the bottom */
        }
        .card-tags-item {
            display: inline-block;
            background-color: #003366; /* brand-blue */
            color: #fff;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem; /* 12px */
            font-weight: bold;
        }

        /* Utility Classes */
        .brand-blue { background-color: #003366; }
        .text-brand-blue { color: #003366; }
        .brand-gold { color: #D4AF37; }
        .fill-brand-blue { fill: #003366; }
        .fill-white { fill: #FFFFFF; }
        
        /* Animations */
        @keyframes fly {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(15px, -25px) scale(1.1); opacity: 0.9; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        .dove-animation { animation: fly 5s ease-in-out infinite; }
        
        /* Form Styles */
        .rtl-form-input { text-align: right; }
        .rtl-form-input::placeholder { text-align: right; }
        .otp-input { text-align: center; font-size: 1.5rem; letter-spacing: 0.5em; }
    `}</style>
);


// --- Icon Components ---
const HeaderLogo: FC<IconProps> = () => (
    <img
        src="/dove_header_logo.png"
        alt="Dove Logo"
        className="h-10 w-auto"
    />
);
const HomeIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
);
const InfoIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
);
const PhoneIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
    </svg>
);
const MenuIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
    </svg>
);
const CloseIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
    </svg>
);

// --- UI Components ---
const MobileNav: FC<{ isOpen: boolean; onClose: () => void }> = ({isOpen, onClose}) => {
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

const Header: FC = () => {
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

const RetailerLink: FC<RetailerLinkProps> = ({imgSrc, alt}) => (
    <a href="/"
       className="block w-full bg-white rounded-lg py-3 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200">
        <img src={imgSrc} alt={alt} className="mx-auto h-8 object-contain"/>
    </a>
);

const ProductCard: FC<ProductCardProps> = ({product}) => (
    <div className="list-card-item">
        <div className="card-item--image">
            <a href="/">
                <div className="cmp-image">
                    <picture>
                        {/* In a real app, you might have different images for different screen sizes */}
                        <source srcSet={product.imgSrc} media="screen and (min-width: 320px)"/>
                        <img src={product.imgSrc} className="cmp-image__image" alt={product.title} loading="lazy"/>
                    </picture>
                </div>
            </a>
        </div>
        <div className="card-item--details">
            <div className="title">
                <a href="/">
                    <h3 className="card-title" title={product.title}>{product.title}</h3>
                </a>
            </div>
            {/* Rating section is removed per request */}
            <div className="card-tags">
                <a href="/">
                    <h3 className="card-sub-title"
                        title="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ">لورم ایپسوم متن ساختگی با
                        تولید سادگی نامفهوم از صنعت چاپ</h3>
                </a>
            </div>
        </div>
    </div>
);


// --- Section Components ---

const HeroSection: FC = () => (
    <section
        className="scroll-section text-center bg-white justify-start pt-20">

        <div className="w-full">
            <img src="/dove-shampoo-conditoner.png" alt="Dove Products" className="mx-auto w-full max-w-md"/>
        </div>
        <div className="relative mt-2 flex-grow w-full flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 z-10">
                <svg className="w-16 h-16 brand-gold dove-animation" viewBox="0 0 100 100"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor"
                          d="M73.5,43.4c-4.4,0-8.4,1.8-11.3,4.7c-0.4,0.4-0.8,0.8-1.2,1.3c-2.8,3.2-4.5,7.3-4.5,11.8c0,1-0.8,1.8-1.8,1.8 s-1.8-0.8-1.8-1.8c0-5.5,2.1-10.6,5.9-14.4c0.5-0.5,1-1,1.5-1.5c3.5-3.5,8.3-5.6,13.5-5.6c1,0,1.8,0.8,1.8,1.8 C75.3,42.6,74.5,43.4,73.5,43.4z M92.5,25.8c-2.4-2.4-5.7-3.8-9.1-3.8c-3.4,0-6.7,1.3-9.1,3.8c-5.1,5.1-5.1,13.3,0,18.4 c2.4,2.4,5.7,3.8,9.1,3.8s6.7-1.3,9.1,3.8C97.5,39.1,97.5,30.8,92.5,25.8z M86.6,37.3c-1.4,1.4-3.3,2.2-5.3,2.2s-3.9-0.8-5.3-2.2 c-2.9-2.9-2.9-7.7,0-10.6c1.4-1.4,3.3-2.2,5.3,2.2s3.9,0.8,5.3,2.2C89.5,29.6,89.5,34.4,86.6,37.3z M50,62.5 c-6.9,0-12.5,5.6-12.5,12.5S43.1,87.5,50,87.5s12.5-5.6,12.5-12.5S56.9,62.5,50,62.5z M26.5,43.4c-1,0-1.8-0.8-1.8-1.8 s0.8-1.8,1.8-1.8c5.2,0,10-2.1,13.5-5.6c0.5-0.5,1-1,1.5-1.5c3.8-3.8,5.9-8.8,5.9-14.4c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8 c0,4.5-1.7,8.6-4.5,11.8c-0.4,0.4-0.8,0.9-1.2,1.3C34.8,41.6,30.9,43.4,26.5,43.4z M16.7,37.3c-1.4-1.4-3.3,2.2-5.3-2.2 s-3.9,0.8-5.3,2.2c-2.9-2.9-2.9-7.7,0-10.6c1.4-1.4,3.3-2.2,5.3,2.2s3.9-0.8,5.3,2.2C19.6,34.4,19.6,29.6,16.7,37.3z M7.5,25.8 C2.5,30.8,2.5,39.1,7.5,44.2c2.4,2.4,5.7,3.8,9.1,3.8s6.7-1.3,9.1,3.8c5.1-5.1,5.1-13.3,0-18.4c-2.4-2.4-5.7-3.8-9.1-3.8 C13.3,22,9.9,23.4,7.5,25.8z"/>
                </svg>
            </div>
        </div>
    </section>
);

const VideoSection: FC = () => (
    <section className="scroll-section bg-gray-50 text-center p-4">
        <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue mb-6">
                زیبایی واقعی را کشف کنید
            </h2>
            <div className="video-responsive-container rounded-lg shadow-xl bg-black">
                <iframe
                    className="video-responsive-iframe"
                    src="https://www.youtube.com/embed/jcO2I1_zG-E?autoplay=1&mute=1&loop=1&playlist=jcO2I1_zG-E&controls=0&showinfo=0&modestbranding=1"
                    title="Dove Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </section>
);


const CtaSection: FC<CtaSectionProps> = ({onOpenModal}) => (
    <section className="scroll-section text-center bg-white">
        <div className="w-full max-w-xs">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-blue">لورم ایپسوم متن ساختگی با تولید
                سادگی</h2>
            <p className="text-gray-500 mt-3 text-base">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
            <button onClick={onOpenModal}
                    className="brand-blue text-white font-bold py-3 px-12 rounded-lg mt-8 w-full shadow-md hover:opacity-90 transition-opacity text-lg">
                Call to action
            </button>
        </div>
    </section>
);

const ProductSection: FC<ProductSectionProps> = ({products}) => (
    <section className="bg-gray-100 py-16 px-4">
        <div
            className="w-full max-w-sm mx-auto space-y-4 product-list-scroll">
            {products.map((product, index) => (
                <ProductCard key={index} product={product}/>
            ))}
        </div>
    </section>
);

const FooterSection: FC = () => (
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

const ModalHeader: FC<{ onBack: () => void; title: string; subtitle: string }> = ({onBack, title, subtitle}) => (
    <>
        <div
            className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-brand-blue text-center flex-grow">{title}</h2>
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-800 flex items-center">
                بازگشت
            </button>
        </div>
        <p className="text-gray-500 text-sm text-center mb-6">{subtitle}</p>
    </>
);


const SignUpModal: FC<SignUpModalProps> = ({isOpen, onClose}) => {
    const [modalStep, setModalStep] = useState<number>(1);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(115);

    useEffect(() => {
        let interval: number | undefined;
        if (isOpen && timer > 0) {
            interval = window.setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isOpen, timer]);

    useEffect(() => {
        if (isOpen) {
            setModalStep(1);
            setTermsAccepted(false);
            setTimer(115);
        }
    }, [isOpen]);

    const handleInfoSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalStep(2);
    };
    const handleGoBackToStep1 = () => setModalStep(1);
    const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
             onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto"
                 onClick={(e) => e.stopPropagation()}>
                {modalStep === 1 ? (
                    <div className="p-6">
                        <ModalHeader
                            onBack={onClose}
                            title="خوش آمدید!"
                            subtitle="لطفا شماره موبایل و نام و نام خانوادگی خود را وارد کنید."
                        />
                        <form onSubmit={handleInfoSubmit}>
                            <input type="text" placeholder="نام و نام خانوادگی"
                                   className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   required/>
                            <input type="tel" placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                                   className="rtl-form-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   required/>
                            <div className="flex items-center my-6">
                                <p className="text-sm text-gray-500 ml-auto">{formatTime(timer)}</p>
                                <input type="checkbox" id="terms" checked={termsAccepted}
                                       onChange={(e: ChangeEvent<HTMLInputElement>) => setTermsAccepted(e.target.checked)}
                                       className="ml-2"/>
                                <label htmlFor="terms" className="text-xs text-gray-700">
                                    <a href="/" className="text-blue-600 hover:underline">قوانین و شرایط</a> را مطالعه
                                    کردم و با آن موافقم.
                                </label>
                            </div>
                            <button type="submit"
                                    className="brand-blue text-white font-bold py-3 rounded-lg w-full transition-opacity disabled:opacity-50"
                                    disabled={!termsAccepted}>ارسال
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <ModalHeader
                            onBack={handleGoBackToStep1}
                            title="کد تایید"
                            subtitle="لطفا کد ۴ رقمی ارسال شده به شماره ۰۹۱۲۳۴۵۶۷۸۹ را وارد نمایید!"
                        />
                        <form>
                            <input type="text" placeholder="کد تایید"
                                   className="otp-input w-full px-4 py-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 mb-4"
                                   maxLength={4} required/>
                            <div className="flex justify-between items-center my-6">
                                <p className="text-sm text-gray-500">{formatTime(timer)}</p>
                                <a href="/" onClick={(e) => {
                                    e.preventDefault();
                                    handleGoBackToStep1();
                                }} className="text-xs text-blue-600 hover:underline">شماره موبایل اشتباه است؟</a>
                            </div>
                            <button type="submit"
                                    className="brand-blue text-white font-bold py-3 rounded-lg w-full">نمایش سوالات
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const handleOpenModal = (): void => setIsModalOpen(true);
    const handleCloseModal = (): void => setIsModalOpen(false);

    return (
        <>
            <GlobalStyles/>
            <Header/>
            <main className="mx-auto">
                {/* Sections with the sticky effect are wrapped */}
                <div className="sticky-wrapper">
                    <HeroSection/>
                    <VideoSection/>
                    <CtaSection onOpenModal={handleOpenModal}/>
                </div>

                {/* Sections below scroll normally */}
                <ProductSection products={products}/>
                <FooterSection/>
            </main>
            <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal}/>
        </>
    );
};

export default App;