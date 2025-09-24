import {type FC} from 'react';

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
        
        /* The main scroll container */
        .product-list-scroll {
            display: flex;
            /* This creates space between cards */
            gap: 1rem; /* 16px */
        
            /* This is the key for the "peeking" effect */
            /* It adds space on the sides of the whole list */
            padding: 0 1rem; /* 16px horizontal padding */
        
            /* Scroll behavior */
            overflow-x: auto;
            scroll-snap-type: x mandatory;
        
            /* Hide the scrollbar */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
        }
        
        /* Hides scrollbar for Chrome, Safari and Opera */
        .product-list-scroll::-webkit-scrollbar {
            display: none;
        }
        
        
        /* The individual product card */
        .list-card-item {
            /* --- Main change is here --- */
            /* Card takes up 80% of the screen width */
            width: 80%;
        
            /* Prevents the card from shrinking */
            flex-shrink: 0;
        
            /* This makes the scroll stop perfectly at the start of each card */
            scroll-snap-align: start;
        
            /* Other styles you already had */
            display: flex;
            flex-direction: column;
            text-align: right;
            overflow: hidden;
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
        .card-item--image {
            /* Give the image container a fixed height */
            width: 100%;
            overflow: hidden; /* Ensures the image corners are rounded if you add border-radius */
        }
        
        /* The image itself */
        .card-item--image .cmp-image__image {
            width: 100%;
            height: 100%;
            /* This is the key property */
            object-fit: cover; 
        }
        .card-item--details {
            padding-top: 1rem;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
        }
        .card-item--details .title {
            margin-bottom: 0.1rem;
        }
        .card-item--details .card-title {
            font-size: 1.125rem; /* 18px */
            font-weight: 700;
            color: #797776; /* Tailwind gray-600 */
        }
        .card-item--details .card-sub-title {
            font-size: 12px; /* 18px */
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
        .concave-top {
            position: relative;
            background-color: 003366;
            overflow: hidden; /* This is key to clip the pseudo-element */
        }
        .concave-top::before {
            content: '';
            position: absolute;
            top: -40px; /* Controls the depth of the curve */
            left: 50%;
            transform: translateX(-50%);
            width: 150%; /* Make it wider than the container */
            height: 80px; /* Controls the height of the curve */
            border-radius: 50%;
            /* This creates a "hole" by casting a huge shadow 
               with the same color as the body's background. */
            box-shadow: 0 0 0 1000000px #003366; /* This is the hex for bg-gray-100 */
        }
    `}</style>
);

export default GlobalStyles;