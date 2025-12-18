import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import GlobalStyles from "./styles/GlobaleStyles";
import { Header as TopBar } from "./components/layout/Header";
import { VideoSection } from "./components/sections/VideoSection";
import { HeroSection } from "./components/sections/HeroSection";
import { CtaSection } from "./components/sections/CtaSection";
import { ProductSection } from "./components/sections/ProductSection";
import { products } from "./constants";
import SignUpModal from "./components/modal/SignUpModal";
import { Footer } from "./components/layout/Footer";
import { HsePage } from "./components/hse/HsePage";
const AppInner = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const location = useLocation();
    const isHseRoute = location.pathname.startsWith("/hse");
    const Home = (_jsxs(_Fragment, { children: [_jsxs("header", { id: "home-section", className: "sticky-wrapper", "aria-labelledby": "page-hero-heading", children: [_jsx("h1", { id: "page-hero-heading", className: "sr-only", children: "\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0648 \u06A9\u0645\u067E\u06CC\u0646 \u062F\u0627\u0648" }), _jsx(HeroSection, {}), _jsx(VideoSection, {}), _jsx(CtaSection, { onOpenModal: handleOpenModal })] }), _jsxs("section", { "aria-labelledby": "products-heading", children: [_jsx("h2", { id: "products-heading", className: "sr-only", children: "\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC \u062F\u0627\u0648" }), _jsx(ProductSection, { products: products })] })] }));
    return (_jsxs(_Fragment, { children: [_jsx(GlobalStyles, {}), !isHseRoute && _jsx(TopBar, {}), _jsx("main", { className: isHseRoute ? "" : "mx-auto", role: "main", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: Home }), _jsx(Route, { path: "/hse", element: _jsx(HsePage, {}) })] }) }), !isHseRoute && _jsx(Footer, {}), !isHseRoute && (_jsx(SignUpModal, { isOpen: isModalOpen, onClose: handleCloseModal }))] }));
};
const App = () => {
    return _jsx(AppInner, {});
};
export default App;
