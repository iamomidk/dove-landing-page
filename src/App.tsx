import { useState, type FC } from "react";
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

const AppInner: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const location = useLocation();
    const isHseRoute = location.pathname.startsWith("/hse");

    const Home = (
        <>
            <header
                id="home-section"
                className="sticky-wrapper"
                aria-labelledby="page-hero-heading"
            >
                <h1 id="page-hero-heading" className="sr-only">
                    محصولات و کمپین داو
                </h1>

                <HeroSection />
                <VideoSection />
                <CtaSection onOpenModal={handleOpenModal} />
            </header>

            <section aria-labelledby="products-heading">
                <h2 id="products-heading" className="sr-only">
                    محصولات پیشنهادی داو
                </h2>
                <ProductSection products={products} />
            </section>
        </>
    );

    return (
        <>
            <GlobalStyles />

            {/* Only show the landing header/footer on non-HSE routes */}
            {!isHseRoute && <TopBar />}

            <main className={isHseRoute ? "" : "mx-auto"} role="main">
                <Routes>
                    <Route path="/" element={Home} />
                    {/* HSE route with totally different design */}
                    <Route path="/hse" element={<HsePage />} />
                </Routes>
            </main>

            {!isHseRoute && <Footer />}
            {!isHseRoute && (
                <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
            )}
        </>
    );
};

const App: FC = () => {
    return <AppInner />;
};

export default App;
