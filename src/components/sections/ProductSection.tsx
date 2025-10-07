import type {FC} from "react";
import type {ProductSectionProps} from "../../types";
import {ProductCard} from "../ui/ProductCard";

export const ProductSection: FC<ProductSectionProps> = ({products}) => (
    <section id="intro-section" className="bg-gray-100 py-16 px-4 mt-4">
        <div className="w-full max-w-6xl mx-auto product-list-scroll">
            {
                products.map(
                    (
                        product, index
                    ) => (
                        <ProductCard key={index} product={product}/>
                    )
                )
            }
        </div>
    </section>
);