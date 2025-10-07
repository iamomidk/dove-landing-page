import type {FC} from "react";

export const HeroSection: FC = () => (
    <section
        className="scroll-section text-center bg-contain bg-center bg-no-repeat relative"
        style={{backgroundImage: "url('/dove-shampoo-conditoner.jpg')"}}
    >

        {/*<div className="w-full">
            <img src="/dove-shampoo-conditoner.jpg" alt="Dove Products" className="mx-auto w-full max-w-md"/>
        </div>*/}
        <div className="relative mt-2 flex-grow w-full flex items-center justify-center">
        </div>
    </section>
);
