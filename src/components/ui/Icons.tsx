import {type FC} from "react";
import {type IconProps} from "../../types";

// --- Icon Components ---

export const HeaderLogo: FC<IconProps> = () => (
    <img
        src="/dove_header_logo.webp"
        alt="Dove Logo"
        className="h-8 w-auto"
    />
);
export const CopyLogo: FC<IconProps> = () => (
    <img
        src="/copy.webp"
        alt="copy Logo"
        className="h-4 w-4"
    />
);

export const HomeIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
);

export const InfoIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
);

export const MenuIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/>
    </svg>
);

export const CloseIcon: FC<IconProps> = ({className = "w-6 h-6"}) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
    </svg>
);

export const ArrowLeft: FC<IconProps> = ({className = "h-6 w-6"}) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M12 0C18.627 0 24 5.373 24 12S18.627 24 12 24 0 18.627 0 12 5.373 0 12 0ZM7.293 12.707 13.293 18.707c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L9.414 12l5.293-5.293c.391-.391.391-1.023 0-1.414-.391-.391-1.023-.391-1.414 0L7.293 11.293c-.391.391-.391 1.023 0 1.414Z"
            fill="currentColor"
        />
    </svg>
);

export const PhoneIcon: FC<IconProps> = ({className = "h-6 w-6"}) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C18.627 0 24 5.373 24 12S18.627 24 12 24 0 18.627 0 12 5.373 0 12 0ZM5 11.04C5 7.159 8.141 4 12 4s7 3.159 7 7.04v.64 1.92c0 .707-.569 1.28-1.273 1.28h-1.273V11.68c0-.694.55-1.256 1.236-1.276C17.376 7.516 14.957 5.28 12 5.28S6.624 7.516 6.31 10.404C6.995 10.424 7.545 10.986 7.545 11.68v3.2H6.273C5.57 14.88 5 14.307 5 13.6v-.427V11.04ZM16.455 16.8v-.64h1.273v.64c0 1.406-1.147 2.56-2.545 2.56h-2.081a1.28 1.28 0 1 1-2.227-1.135A1.28 1.28 0 0 1 12 17.44c.223.001.442.06.635.172.193.112.354.274.465.468h2.082c.71 0 1.273-.565 1.273-1.28Z"
            fill="currentColor"
        />
    </svg>
);

export const InstagramIcon: FC<IconProps> = ({className = "h-6 w-6"}) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C18.627 0 24 5.373 24 12S18.627 24 12 24 0 18.627 0 12 5.373 0 12 0ZM5.25 9.239c0-2.199 1.789-3.989 3.989-3.989h5.523c2.2 0 3.989 1.79 3.989 3.989v5.523c0 2.199-1.789 3.989-3.989 3.989H9.239A3.989 3.989 0 0 1 5.25 14.761V9.239ZM15.682 7.705a.636.636 0 1 1 0 1.273.636.636 0 0 1 0-1.273ZM12 8.625A3.375 3.375 0 1 1 8.625 12 3.375 3.375 0 0 1 12 8.625Zm-2.761 3.375A2.761 2.761 0 1 0 12 9.239a2.761 2.761 0 0 0-2.761 2.761Z"
            fill="currentColor"
        />
    </svg>
);
