import {type FC, useEffect, useId, useState} from "react";
import type {ProductCardProps} from "../../types";

export const ProductCard: FC<ProductCardProps> = ({product}) => {
    const [isActive, setIsActive] = useState(false);
    const overlayId = useId();

    const toggleOverlay = () => setIsActive((v) => !v);
    const closeOverlay = () => setIsActive(false);

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
            {/* Image + toggle button */}
            <div className="card-item--image">
                <div className="cmp-image">
                    <picture>
                        <source srcSet={product.imgSrc} media="screen and (min-width: 320px)"/>
                        <img
                            src={product.imgSrc}
                            className="cmp-image__image"
                            alt={product.title}
                            loading="lazy"
                        />
                    </picture>
                </div>

                {/* Use a real button to toggle overlay */}
                <button
                    type="button"
                    onClick={toggleOverlay}
                    className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-expanded={isActive}
                    aria-controls={overlayId}
                    aria-label={isActive ? "بستن جزئیات محصول" : "نمایش جزئیات محصول"}
                    // This button sits over the image to capture taps/clicks; keep it visually invisible.
                    style={{background: "transparent"}}
                />

                {/* Overlay (clickable only when active) */}
                <div
                    id={overlayId}
                    className="card-overlay"
                    // enable pointer interactions only when active, otherwise preserve original behavior
                    style={{pointerEvents: isActive ? "auto" : "none"}}
                    aria-hidden={!isActive}
                >
                    <div className="overlay-content">
                        <h3
                            id={`${overlayId}-title`}
                            className="overlay-title"
                            style={{color: product.hoverTextColor}}
                        >
                            {product.hoverTitle}
                        </h3>
                        <p className="overlay-desc" style={{color: "#797776"}}>
                            {product.hoverDesc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card details */}
            <div className="card-item--details">
                <div className="title">
                    <h3 className="card-title font-bold" title={product.title}>
                        {product.title}
                    </h3>
                </div>
                <div className="card-tags">
                    <h3 className="card-sub-title font-semibold" title={product.description}>
                        {product.description}
                    </h3>
                </div>
            </div>
        </article>
    );
};