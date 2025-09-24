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

export interface RetailerLinkProps {
    imgSrc: string;
    alt: string;
    href: string;
    borderColor: string;
}

export interface IconProps {
    className?: string;
}