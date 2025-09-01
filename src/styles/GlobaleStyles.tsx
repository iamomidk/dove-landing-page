import { type FC } from 'react';

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
            border: none;
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

export default GlobalStyles;