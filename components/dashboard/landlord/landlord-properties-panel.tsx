"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Bath,
    BedDouble,
    Building2,
    CircleCheck,
    CircleOff,
    House,
    MapPin,
    Maximize2,
    Plus,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

import { PropertyImage } from "@/components/properties/property-image";
import { getLandlordProperties } from "@/lib/api/landlord-properties-client";
import type {
    LandlordProperty,
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

const statusStyles: Record<PropertyStatus, string> = {
    AVAILABLE:
        "border-emerald-700/30 bg-emerald-100 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950 dark:text-emerald-200",
    RENTED:
        "border-blue-700/30 bg-blue-100 text-blue-900 dark:border-blue-400/40 dark:bg-blue-950 dark:text-blue-200",
    UNAVAILABLE:
        "border-zinc-600/30 bg-zinc-200 text-zinc-900 dark:border-zinc-400/40 dark:bg-zinc-800 dark:text-zinc-100",
};

function PropertyListSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="aspect-[16/9] animate-pulse bg-surface-muted" />

            <div className="space-y-4 p-5">
                <div className="flex justify-between gap-4">
                    <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-6 w-20 animate-pulse rounded-lg bg-surface-muted" />
                </div>

                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-surface-muted" />

                <div className="flex gap-3 border-t border-border pt-4">
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                </div>
            </div>
        </div>
    );
}

type PropertySummaryProps = Readonly<{
    label: string;
    value: number;
    icon: typeof Building2;
}>;

function PropertySummary({
    label,
    value,
    icon: Icon,
}: PropertySummaryProps) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    {value}
                </p>
            </div>

            <p className="mt-4 text-sm font-medium text-muted-foreground">
                {label}
            </p>
        </article>
    );
}

type LandlordPropertyCardProps = Readonly<{
    property: LandlordProperty;
}>;

function LandlordPropertyCard({
    property,
}: LandlordPropertyCardProps) {
    const primaryImageUrl =
        property.images?.find((imageUrl) => imageUrl.trim()) ?? null;

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={primaryImageUrl ?? "property-placeholder"}
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${property.title}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                />

                <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${statusStyles[property.status]}`}
                >
                    {statusLabels[property.status]}
                </span>

                <span className="absolute right-4 top-4 rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {property.category.name}
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="line-clamp-1 text-lg font-semibold tracking-[-0.025em] text-foreground">
                            {property.title}
                        </h2>

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
        </article>
    );
}

export function LandlordPropertiesPanel() {
    const {
        data: properties = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["landlord", "properties"],
        queryFn: getLandlordProperties,
    });

    const availableCount = properties.filter(
        (property) => property.status === "AVAILABLE",
    ).length;

    const rentedCount = properties.filter(
        (property) => property.status === "RENTED",
    ).length;

    const unavailableCount = properties.filter(
        (property) => property.status === "UNAVAILABLE",
    ).length;

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Your properties could not be loaded.";

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Property management
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Your rental properties
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Review your listings, availability, pricing, and essential
                        property details.
                    </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                    {isFetching && !isLoading && (
                        <p
                            role="status"
                            className="text-sm font-medium text-brand"
                        >
                            Updating properties...
                        </p>
                    )}

                    <Link
                        href="/dashboard/landlord/properties/new"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        <Plus aria-hidden="true" className="size-4" />
                        Add property
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="h-32 animate-pulse rounded-2xl border border-border bg-surface-muted"
                            />
                        ))}
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }, (_, index) => (
                            <PropertyListSkeleton key={index} />
                        ))}
                    </div>
                </>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-muted text-brand">
                        <RefreshCw aria-hidden="true" className="size-6" />
                    </span>

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Properties could not be loaded
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching ? "Trying again..." : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <PropertySummary
                            label="Total properties"
                            value={properties.length}
                            icon={Building2}
                        />

                        <PropertySummary
                            label="Available"
                            value={availableCount}
                            icon={CircleCheck}
                        />

                        <PropertySummary
                            label="Rented"
                            value={rentedCount}
                            icon={House}
                        />

                        <PropertySummary
                            label="Unavailable"
                            value={unavailableCount}
                            icon={CircleOff}
                        />
                    </div>

                    {properties.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                                You have not listed any properties
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
                                Your property listings will appear here after you create
                                your first rental property.
                            </p>

                            <Link
                                href="/dashboard/landlord/properties/new"
                                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                            >
                                <Plus aria-hidden="true" className="size-4" />
                                Create your first property
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {properties.map((property) => (
                                <LandlordPropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}