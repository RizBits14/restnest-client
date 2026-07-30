import {
    Bath,
    BedDouble,
    MapPin,
    Maximize2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Property } from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

type PropertyCardProps = Readonly<{
    property: Property;
}>;

export function PropertyCard({ property }: PropertyCardProps) {
    return (
        <article className="group overflow-hidden rounded-[1.75rem] border border-border bg-surface transition-transform duration-200 hover:-translate-y-1">
            <Link
                href={`/properties/${property.id}`}
                aria-label={`View details for ${property.title}`}
                className="block h-full"
            >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                    <Image
                        src="/property-placeholder.svg"
                        alt={`Rental property placeholder for ${property.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />

                    <span className="absolute left-4 top-4 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-brand">
                        {property.category.name}
                    </span>
                </div>

                <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="line-clamp-1 text-lg font-semibold tracking-[-0.025em] text-foreground">
                                {property.title}
                            </h3>

                            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-brand"
                                />

                                <span className="line-clamp-1">
                                    {property.location}
                                </span>
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-lg font-semibold text-brand">
                                {currencyFormatter.format(property.price)}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Total payment
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <BedDouble
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            {property.bedrooms} beds
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <Bath
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            {property.bathrooms} baths
                        </span>

                        {property.area !== null && (
                            <span className="inline-flex items-center gap-1.5">
                                <Maximize2
                                    aria-hidden="true"
                                    className="size-4 text-brand"
                                />
                                {property.area} sq ft
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}