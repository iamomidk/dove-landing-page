import {useState, type FC} from 'react';
import GlobalStyles from "./styles/GlobaleStyles.tsx";
import {Header} from "./components/layout/Header.tsx";
import {VideoSection} from "./components/sections/VideoSection.tsx";
import {HeroSection} from "./components/sections/HeroSection.tsx";
import {CtaSection} from "./components/sections/CtaSection.tsx";
import {ProductSection} from "./components/sections/ProductSection.tsx";
import {products} from "./constants";
import SignUpModal from "./components/modal/SignUpModal.tsx";
import {Footer} from "./components/layout/Footer.tsx";

const App: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <GlobalStyles/>
            <Header/>
            <main className="mx-auto">
                <div className="sticky-wrapper">
                    <HeroSection/>
                    <VideoSection/>
                    <CtaSection onOpenModal={handleOpenModal}/>
                </div>
                <ProductSection products={products}/>
                <Footer/>
            </main>
            <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal}/>
        </>
    );
};

export default App;