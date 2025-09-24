import type {FC} from "react";
import type {ProductCardProps} from "../../types";

export const ProductCard: FC<ProductCardProps> = ({product}) => (
    <div className="list-card-item">
        <div className="card-item--image">
            <a href="/">
                <div className="cmp-image">
                    <picture>
                        {/* In a real app, you might have different images for different screen sizes */}
                        <source srcSet={product.imgSrc} media="screen and (min-width: 320px)"/>
                        <img src={product.imgSrc} className="cmp-image__image" alt={product.title} loading="lazy"/>
                    </picture>
                </div>
            </a>
        </div>
        <div className="card-item--details">
            <div className="title">
                <a href="/">
                    <h3 className="card-title" title={product.title}>{product.title}</h3>
                </a>
            </div>
            {/* Rating section is removed per request */}
            <div className="card-tags">
                <a href="/">
                    <h3 className="card-sub-title" title={product.description}>{product.description}</h3>
                </a>
            </div>
        </div>
    </div>
);
