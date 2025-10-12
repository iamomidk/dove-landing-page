import {type FC} from "react";

const GlobalStyles: FC = () => (
    <style>{`
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;800&display=swap');

    /* Local UnileverDesire Fonts */
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-BoldItalic.ttf') format('truetype');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-Light.ttf') format('truetype');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-LightItalic.ttf') format('truetype');
      font-weight: 300;
      font-style: italic;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-RegularItalic.ttf') format('truetype');
      font-weight: 400;
      font-style: italic;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
    }
    @font-face {
      font-family: 'UnileverDesire';
      src: url('/fonts/UnileverDesire-SemiBoldItalic.ttf') format('truetype');
      font-weight: 600;
      font-style: italic;
    }

    /* Base body styles */
    body {
      font-family: 'Vazirmatn', 'UnileverDesire', sans-serif;
      background-color: #f8f9fa;
      direction: rtl;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    body::-webkit-scrollbar { display: none; }

    /* Sticky wrapper & sections */
    .sticky-wrapper { height: 300vh; position: relative; }
    .scroll-section {
      min-height: 100svh;
      height: auto;
      width: 100%;
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .product-list-scroll {
      display: flex;
      flex-direction: column;   /* stack cards vertically */
      gap: 1rem;
      padding: 1rem 0;
      overflow-y: auto;         /* vertical scrolling */
    }
    .product-list-scroll::-webkit-scrollbar { width: 8px; }
    .product-list-scroll::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    }

    /* Product card */
    .list-card-item {
      position: relative;
      overflow: hidden;
      width: 100%;
      flex-shrink: 0;
      scroll-snap-align: start;
      padding-right: 2rem;
      padding-left: 2rem;
      padding-bottom: 2rem;
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
      text-align: right;
      cursor: pointer;
      transition: none;
    }

    /* Overlay for hover/click */
    .card-overlay {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      padding: 1rem 2rem;
      color: rgba(255,255,255,0.25);
      pointer-events: none; /* default: not interactive */
    }
    .list-card-item:hover .card-overlay,
    .list-card-item.active .card-overlay {
      opacity: 1;
      pointer-events: auto; /* ✅ now interactive only when visible */
    }

    .overlay-content .overlay-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-align: justify;
      white-space: nowrap;        /* ✅ keep in one line */
      overflow: hidden;           /* hide overflow if too long */
      text-overflow: ellipsis;    /* show … if cut off */
    }
    .overlay-content .overlay-desc {
      font-size: 1rem;
      font-weight: 400;
      color: #797776;
      text-align: justify;
      line-height: 1.5;
      white-space: pre-line;
    }

    /* Image container */
    .card-item--image { width: 100%; overflow: hidden; position: relative; }
    .card-item--image .cmp-image__image {
      width: 100%; height: 100%; object-fit: cover;
      transition: filter 0.3s ease;
    }
    .list-card-item:hover .cmp-image__image,
    .list-card-item.active .cmp-image__image { filter: blur(30px); }

    /* Card details */
    .card-item--details { padding-top: 1rem; display: flex; flex-direction: column; flex-grow: 1; }
    .card-item--details .title { margin-bottom: 0.1rem; }
    .card-item--details .card-title {
      font-size: 18px;
      color: #797776;
    }
    .card-item--details .card-sub-title {
      font-size: 14px;
      color: #001F5F;
      white-space: pre-line;
    }
    .card-item--details a { text-decoration: none; }

    /* Tags */
    .card-tags {  }
    .card-tags-item {
      display: inline-block;
      background-color: #003366;
      color: #fff;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    /* Utility classes */
    .brand-blue { background-color: #003366; }
    .text-brand-blue { color: #003366; }
    .brand-gold { color: #D4AF37; }
    .fill-brand-blue { fill: #003366; }
    .fill-white { fill: #FFFFFF; }

    /* Animations */
    @keyframes fly {
      0% { transform: translate(0,0) scale(1); opacity: 1; }
      50% { transform: translate(15px,-25px) scale(1.1); opacity: 0.9; }
      100% { transform: translate(0,0) scale(1); opacity: 1; }
    }
    .dove-animation { animation: fly 5s ease-in-out infinite; }

    /* Forms */
    .rtl-form-input { text-align: right; }
    .rtl-form-input::placeholder { text-align: right; }
    .otp-input { text-align: center; font-size: 1.5rem; letter-spacing: 0.5em; }

    /* Responsive video */
    .video-responsive-container { position: relative; overflow: hidden; width: 100%; padding-top: 56.25%; }
    .video-responsive-iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

    /* ✅ Accessibility polish */
    button:focus-visible {
      outline: 2px solid #003366;
      outline-offset: 2px;
    }
    
    @keyframes pulse-ring {
      0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
      70%  { transform: translate(-50%, -50%) scale(1.6); opacity: 0;   }
      100% { transform: translate(-50%, -50%) scale(1);   opacity: 0;   }
    }

    .play-button {
      position: relative;
    }
    .play-button::before {
      content: "";
      position: absolute;
      top: 50%; left: 50%;
      width: 120%; height: 120%;
      transform: translate(-50%, -50%) scale(1);
      border-radius: 50%;
      background-color: #003366;
      opacity: 0.6;
      animation: pulse-ring 1.8s cubic-bezier(0.66, 0, 0, 1) infinite;
      z-index: -1;
    }
  `}</style>
);

export default GlobalStyles;
