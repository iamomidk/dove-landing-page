import {type FC, useState} from "react";
import type {RetailerLinkProps} from "../../types";

export const RetailerLink: FC<RetailerLinkProps> = ({imgSrc, alt, href, borderColor}) => {
    // State to track if the link has been clicked or is being hovered
    const [isClicked, setIsClicked] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Handler to toggle the clicked state
    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    // Base classes for the link
    const baseClasses = "block w-full py-3 px-4 text-center transition-all duration-300 transform focus:outline-none";

    // Classes for the unclicked state (hover classes removed)
    const unclickedClasses = `bg-white border-b-4 shadow-sm`;

    // Classes for the clicked and hovered state
    const activeClasses = "bg-white border-b-4 border-2  shadow-lg scale-105";

    // Determine if the link should be in its active state
    const isActive = isClicked || isHovering;

    return (
        <a
            href={href}
            // Combine classes based on the active state
            className={`${baseClasses} ${isActive ? activeClasses : unclickedClasses}`}
            // Apply border color via style prop only when unclicked and not hovered
            style={!isActive ? {} : {borderColor: borderColor}}
            onClick={(e) => {
                e.preventDefault(); // Prevent navigation for this example
                handleClick();
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img
                src={imgSrc}
                alt={alt}
                className="mx-auto h-8 object-contain"
            />
        </a>
    );
};