import type {FC} from "react";
import type {RetailerLinkProps} from "../../types";

export const RetailerLink: FC<RetailerLinkProps> = ({imgSrc, alt}) => (
    <a href="/"
       className="block w-full bg-white rounded-lg py-3 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200">
        <img src={imgSrc} alt={alt} className="mx-auto h-8 object-contain"/>
    </a>
);
