"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackImage = "/property-placeholder.svg";

const allowedRemoteHostnames = new Set([
    "cdn.pixabay.com",
]);

type PropertyImageProps = Readonly<{
    imageUrl?: string | null;
    alt: string;
    sizes: string;
    className?: string;
}>;

function getSafeImageSource(imageUrl?: string | null) {
    const trimmedImageUrl = imageUrl?.trim();

    if (!trimmedImageUrl) {
        return fallbackImage;
    }

    if (trimmedImageUrl.startsWith("/")) {
        return trimmedImageUrl;
    }

    try {
        const parsedUrl = new URL(trimmedImageUrl);

        const hasValidProtocol =
            parsedUrl.protocol === "https:" ||
            parsedUrl.protocol === "http:";

        const hasAllowedHostname =
            allowedRemoteHostnames.has(parsedUrl.hostname);

        if (!hasValidProtocol || !hasAllowedHostname) {
            return fallbackImage;
        }

        return trimmedImageUrl;
    } catch {
        return fallbackImage;
    }
}

export function PropertyImage({
    imageUrl,
    alt,
    sizes,
    className,
}: PropertyImageProps) {
    const [source, setSource] = useState(() =>
        getSafeImageSource(imageUrl),
    );

    return (
        <Image
            src={source}
            alt={alt}
            fill
            sizes={sizes}
            className={className}
            onError={() => setSource(fallbackImage)}
        />
    );
}