import type {FC} from "react";
import type {ProductSectionProps} from "../../types";
import {ProductCard} from "../ui/ProductCard.tsx";

export const ProductSection: FC<ProductSectionProps> = ({products}) => (
    <section className="bg-gray-100 py-16 px-4">
        <div
            className="w-full max-w-sm mx-auto space-y-4 product-list-scroll">
            {products.map((product, index) => (
                <ProductCard key={index} product={product}/>
            ))}
        </div>
    </section>
);
