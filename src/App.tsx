import { useState, type FC } from "react";
import GlobalStyles from "./styles/GlobaleStyles.tsx";
import { Header as TopBar } from "./components/layout/Header.tsx";
import { VideoSection } from "./components/sections/VideoSection.tsx";
import { HeroSection } from "./components/sections/HeroSection.tsx";
import { CtaSection } from "./components/sections/CtaSection.tsx";
import { ProductSection } from "./components/sections/ProductSection.tsx";
import { products } from "./constants";
import SignUpModal from "./components/modal/SignUpModal.tsx";
import { Footer } from "./components/layout/Footer.tsx";

const App: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <GlobalStyles />
            <TopBar />

            {/* Main landmark */}
            <main className="mx-auto" role="main">
                {/* Page intro / hero in a semantic header */}
                <header className="sticky-wrapper" aria-labelledby="page-hero-heading">
                    {/* Visually-hidden, for SEO/a11y */}
                    <h1 id="page-hero-heading" className="sr-only">
                        محصولات و کمپین داو
                    </h1>

                    <HeroSection />
                    <VideoSection />
                    <CtaSection onOpenModal={handleOpenModal} />
                </header>

                {/* Products section with its own hidden heading */}
                <section aria-labelledby="products-heading">
                    <h2 id="products-heading" className="sr-only">
                        محصولات پیشنهادی داو
                    </h2>
                    <ProductSection products={products} />
                </section>

                <Footer />
            </main>

            <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
};

export default App;
