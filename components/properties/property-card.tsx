import {
    ArrowUpRight,
    Bath,
    BedDouble,
    MapPin,
    Maximize2,
} from "lucide-react";
import Link from "next/link";

import { PropertyImage } from "@/components/properties/property-image";
import type {
    Property,
    PropertyStatus,
} from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const statusLabels: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    RENTED: "Rented",
    UNAVAILABLE: "Unavailable",
};

const statusClasses: Record<PropertyStatus, string> = {
    AVAILABLE: "bg-success-soft text-success",
    RENTED: "bg-info-soft text-info",
    UNAVAILABLE: "bg-surface-muted text-muted-foreground",
};

type PropertyCardProps = Readonly<{
    property: Property;
}>;

function getPrimaryImage(images: string[]) {
    return (
        images.find((imageUrl) => imageUrl.trim().length > 0) ??
        null
    );
}

function getCountLabel(
    count: number,
    singularLabel: string,
) {
    return `${count} ${singularLabel}${count === 1 ? "" : "s"}`;
}

export function PropertyCard({
    property,
}: PropertyCardProps) {
    const primaryImageUrl = getPrimaryImage(property.images);

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-raised">
            <Link
                href={`/properties/${property.id}`}
                aria-label={`View details for ${property.title}`}
                className="flex h-full flex-col rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-inset"
            >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                    <PropertyImage
                        key={
                            primaryImageUrl ?? "property-placeholder"
                        }
                        imageUrl={primaryImageUrl}
                        alt={`Rental property: ${property.title}`}
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                        <span className="max-w-[65%] truncate rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-sm">
                            {property.category.name}
                        </span>

                        <span
                            className={[
                                "shrink-0 rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm",
                                statusClasses[property.status],
                            ].join(" ")}
                        >
                            {statusLabels[property.status]}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-lg font-bold leading-6 tracking-[-0.03em] text-foreground transition-colors duration-200 group-hover:text-brand">
                                {property.title}
                            </h3>

                            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                                <MapPin
                                    aria-hidden="true"
                                    className="mt-1 size-4 shrink-0 text-accent"
                                />

                                <span className="line-clamp-2">
                                    {property.location}
                                </span>
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-lg font-bold tracking-[-0.025em] text-brand">
                                {currencyFormatter.format(property.price)}
                            </p>

                            <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                Total
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <span className="flex min-w-0 items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                            <BedDouble
                                aria-hidden="true"
                                className="size-4 shrink-0 text-brand"
                            />

                            <span className="truncate">
                                {getCountLabel(
                                    property.bedrooms,
                                    "bed",
                                )}
                            </span>
                        </span>

                        <span className="flex min-w-0 items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                            <Bath
                                aria-hidden="true"
                                className="size-4 shrink-0 text-brand"
                            />

                            <span className="truncate">
                                {getCountLabel(
                                    property.bathrooms,
                                    "bath",
                                )}
                            </span>
                        </span>

                        {property.area !== null && (
                            <span className="col-span-2 flex min-w-0 items-center gap-2 rounded-xl bg-surface-subtle px-3 py-2.5 text-xs font-semibold text-muted-foreground sm:col-span-1">
                                <Maximize2
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-brand"
                                />

                                <span className="truncate">
                                    {property.area.toLocaleString()} sq ft
                                </span>
                            </span>
                        )}
                    </div>

                    <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <span className="text-sm font-bold text-foreground">
                                View property
                            </span>

                            <span
                                aria-hidden="true"
                                className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand transition-[background-color,color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-brand group-hover:text-brand-foreground"
                            >
                                <ArrowUpRight className="size-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}