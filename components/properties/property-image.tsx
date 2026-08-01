/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const fallbackImage = "/property-placeholder.svg";

type PropertyImageProps = Readonly<{
    imageUrl?: string | null;
    alt: string;
    sizes: string;
    className?: string;
    priority?: boolean;
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

        if (parsedUrl.protocol !== "https:") {
            return fallbackImage;
        }

        return parsedUrl.toString();
    } catch {
        return fallbackImage;
    }
}

export function PropertyImage({
    imageUrl,
    alt,
    sizes,
    className,
    priority = false,
}: PropertyImageProps) {
    const safeSource = getSafeImageSource(imageUrl);
    const [source, setSource] = useState(safeSource);

    useEffect(() => {
        setSource(safeSource);
    }, [safeSource]);

    function handleImageError() {
        if (source !== fallbackImage) {
            setSource(fallbackImage);
        }
    }

    return (
        <Image
            src={source}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={className}
            onError={handleImageError}
        />
    );
}