import {type FC, useState} from "react";
import type {ProductCardProps} from "../../types";

export const ProductCard: FC<ProductCardProps> = ({product}) => {
    const [isActive, setIsActive] = useState(false);

    const toggleOverlay = () => setIsActive(!isActive);
    const closeOverlay = () => setIsActive(false);

    return (
        <div
            className={`list-card-item ${isActive ? "active" : ""}`}
            onClick={toggleOverlay}
            onMouseLeave={closeOverlay} // optional: close overlay when mouse leaves
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
                        />
                    </picture>
                </div>
                {/* Overlay */}
                <div className="card-overlay">
                    <div
                        className="overlay-content"
                    >
                        <h3 className="overlay-title" style={{color: product.hoverTextColor}}>{product.hoverTitle}</h3>
                        <p className="overlay-desc"style={{ color: "#797776" }}>{product.hoverDesc}</p>
                    </div>
                </div>
            </div>

            <div className="card-item--details">
                <div className="title">
                    <h3 className="card-title" title={product.title}>
                        {product.title}
                    </h3>
                </div>
                <div className="card-tags">
                    <h3 className="card-sub-title" title={product.description}>
                        {product.description}
                    </h3>
                </div>
            </div>
        </div>
    );
};
