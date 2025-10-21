import {type FC, useEffect, useId, useState} from "react";
import type {ProductCardProps} from "../../types";

const sendGAEvent = (action: string, label: string) => {
    if (typeof window.gtag === "function") {
        window.gtag("event", action, {
            event_category: "Product Card",
            event_label: label,
        });
    }
};

export const ProductCard: FC<ProductCardProps> = ({product}) => {
    const [isActive, setIsActive] = useState(false);
    const overlayId = useId();

    const toggleOverlay = () => {
        setIsActive((v) => !v);
        sendGAEvent(!isActive ? "open_overlay" : "close_overlay", product.title);
    };

    const closeOverlay = () => {
        if (isActive) {
            setIsActive(false);
            sendGAEvent("close_overlay", product.title);
        }
    };

    // Close on ESC for a11y
    useEffect(() => {
        if (!isActive) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeOverlay();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isActive]);

    return (
        <article
            className={`list-card-item ${isActive ? "active" : ""}`}
            onMouseLeave={closeOverlay}
            aria-labelledby={`${overlayId}-title`}
        >
            <div className="card-item--image">
                <div className="cmp-image">
                    <picture>
                        <source srcSet={product.imgSrc} media="screen and (min-width: 320px)"/>
                        <img
                            src={product.imgSrc}
                            className="cmp-image__image"
                            alt={product.title}
                            loading="lazy"
                            onClick={() => sendGAEvent("click_image", product.title)}
                        />
                    </picture>
                </div>

                <button
                    type="button"
                    onClick={toggleOverlay}
                    className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-expanded={isActive}
                    aria-controls={overlayId}
                    aria-label={isActive ? "بستن جزئیات محصول" : "نمایش جزئیات محصول"}
                    style={{background: "transparent"}}
                />

                <div
                    id={overlayId}
                    className="card-overlay"
                    style={{pointerEvents: isActive ? "auto" : "none"}}
                    aria-hidden={!isActive}
                >
                    <div className="overlay-content">
                        <h3
                            id={`${overlayId}-title`}
                            className="overlay-title text-lg font-bold"
                            style={{color: product.hoverTextColor}}
                        >
                            {product.hoverTitle}
                        </h3>
                        <p className="overlay-desc text-base font-semibold" style={{color: "#797776"}}>
                            {product.hoverDesc}
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-item--details">
                <div className="title">
                    <h3 className="card-title font-bold" title={product.title}>
                        {product.title}
                    </h3>
                </div>
                <div className="card-tags">
                    <ul className="list-disc pr-4 text-[#001F5F] space-y-1 text-[14px]">
                        {product.description
                            .split("\n")
                            .filter(Boolean)
                            .map((line, i) => (
                                <li key={i}>{line.trim()}</li>
                            ))}
                    </ul>
                </div>
            </div>
        </article>
    );
};