import type {FC} from "react";

export const VideoSection: FC = () => (
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
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </section>
);
