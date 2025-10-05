import {list} from "postcss";

export interface Product {
    imgSrc: string;
    title: string;
    description: string;
    hoverTitle: string;
    hoverDesc: string;
    hoverTextColor: string;
}

export interface ProductSectionProps {
    products: Product[];
}

export interface ProductCardProps {
    product: Product;
}

export interface CtaSectionProps {
    onOpenModal: () => void;
}

export interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export type RetailerId = "okala" | "snapp" | "digikala";

export type RetailerLinkProps = {
    imgSrc: string;
    alt: string;
    href?: string;
    borderColor: string;
    retailer: RetailerId;                 // NEW
    onActivate?: (retailer: RetailerId) => void;  // NEW
    hasDiscount: boolean;
};

export interface IconProps {
    className?: string;
}