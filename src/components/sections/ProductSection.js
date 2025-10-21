import { jsx as _jsx } from "react/jsx-runtime";
import { ProductCard } from "../ui/ProductCard";
export const ProductSection = ({ products }) => (_jsx("section", { id: "intro-section", className: "bg-gray-100 py-16 px-4", children: _jsx("div", { className: "w-full max-w-6xl mx-auto", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto sm:overflow-visible", children: products.map((product, index) => (_jsx(ProductCard, { product: product }, index))) }) }) }));
