import type { FC } from "react";
import type { ProductSectionProps } from "../../types";
import { ProductCard } from "../ui/ProductCard";

export const ProductSection: FC<ProductSectionProps> = ({ products }) => (
    <section
        id="intro-section"
        className="bg-gray-100 py-16 px-4 mt-4"
    >
        <div className="w-full max-w-6xl mx-auto">
            {/* Desktop grid: 3 columns, mobile scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto sm:overflow-visible">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    </section>
);