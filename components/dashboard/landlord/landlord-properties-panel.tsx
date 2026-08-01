"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Bath,
    BedDouble,
    Building2,
    CircleCheck,
    CircleOff,
    House,
    LoaderCircle,
    MapPin,
    Maximize2,
    Plus,
    RefreshCw,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { PropertyCardActions } from "@/components/dashboard/landlord/property-card-actions";
import { PropertyImage } from "@/components/properties/property-image";
import {
    getLandlordProperties,
    landlordPropertiesQueryKey,
} from "@/lib/api/landlord-properties-client";
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
    AVAILABLE: "bg-success-soft text-success",
    RENTED: "bg-info-soft text-info",
    UNAVAILABLE:
        "bg-surface-muted text-muted-foreground",
};

type SummaryTone =
    | "brand"
    | "success"
    | "info"
    | "neutral";

const summaryToneStyles: Record<
    SummaryTone,
    Readonly<{
        icon: string;
        value: string;
    }>
> = {
    brand: {
        icon: "bg-brand-soft text-brand",
        value: "text-brand",
    },
    success: {
        icon: "bg-success-soft text-success",
        value: "text-success",
    },
    info: {
        icon: "bg-info-soft text-info",
        value: "text-info",
    },
    neutral: {
        icon: "bg-surface-muted text-muted-foreground",
        value: "text-foreground",
    },
};

function PropertyListSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="relative aspect-[16/10] animate-pulse bg-surface-muted">
                <div className="absolute left-4 top-4 h-7 w-24 rounded-full bg-surface-elevated/80" />
                <div className="absolute right-4 top-4 h-7 w-20 rounded-full bg-surface-elevated/80" />
            </div>

            <div className="space-y-5 p-5 sm:p-6">
                <div className="flex justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-surface-muted" />
                        <div className="h-4 w-3/5 animate-pulse rounded-lg bg-surface-muted" />
                    </div>

                    <div className="h-11 w-20 animate-pulse rounded-xl bg-surface-muted" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div
                            key={index}
                            className="h-16 animate-pulse rounded-xl bg-surface-muted"
                        />
                    ))}
                </div>

                <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        </div>
    );
}

type PropertySummaryProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone: SummaryTone;
}>;

function PropertySummary({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: PropertySummaryProps) {
    const visualStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${visualStyle.icon}`}
                >
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p
                    className={`text-3xl font-bold tracking-[-0.05em] ${visualStyle.value}`}
                >
                    {value}
                </p>
            </div>

            <h2 className="mt-5 text-sm font-bold text-foreground">
                {label}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </article>
    );
}

type PropertyFeatureProps = Readonly<{
    label: string;
    value: string;
    icon: LucideIcon;
}>;

function PropertyFeature({
    label,
    value,
    icon: Icon,
}: PropertyFeatureProps) {
    return (
        <div className="rounded-xl bg-surface-subtle p-3">
            <p className="flex items-center gap-1.5 text-[0.64rem] font-bold uppercase tracking-[0.09em] text-muted-foreground">
                <Icon
                    aria-hidden="true"
                    className="size-3.5 text-brand"
                />

                {label}
            </p>

            <p className="mt-2 text-sm font-bold text-foreground">
                {value}
            </p>
        </div>
    );
}

type LandlordPropertyCardProps = Readonly<{
    property: LandlordProperty;
}>;

function LandlordPropertyCard({
    property,
}: LandlordPropertyCardProps) {
    const primaryImageUrl =
        property.images?.find((imageUrl) =>
            imageUrl.trim(),
        ) ?? null;

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={
                        primaryImageUrl ??
                        "property-placeholder"
                    }
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${property.title}`}
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <span
                        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm ${statusStyles[property.status]}`}
                    >
                        {statusLabels[property.status]}
                    </span>

                    <span className="max-w-[55%] truncate rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-sm">
                        {property.category.name}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 text-lg font-bold leading-6 tracking-[-0.03em] text-foreground">
                            {property.title}
                        </h2>

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

                    <div className="shrink-0 rounded-xl bg-brand-soft px-3 py-2.5 text-right">
                        <p className="text-base font-bold text-brand">
                            {currencyFormatter.format(property.price)}
                        </p>

                        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            Total
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                    <PropertyFeature
                        label="Beds"
                        value={`${property.bedrooms}`}
                        icon={BedDouble}
                    />

                    <PropertyFeature
                        label="Baths"
                        value={`${property.bathrooms}`}
                        icon={Bath}
                    />

                    <PropertyFeature
                        label="Area"
                        value={
                            property.area !== null
                                ? `${property.area} ft²`
                                : "N/A"
                        }
                        icon={Maximize2}
                    />
                </div>

                <div className="mt-auto pt-5">
                    <PropertyCardActions property={property} />
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
        queryKey: landlordPropertiesQueryKey,
        queryFn: getLandlordProperties,
    });

    const availableCount = properties.filter(
        (property) => property.status === "AVAILABLE",
    ).length;

    const rentedCount = properties.filter(
        (property) => property.status === "RENTED",
    ).length;

    const unavailableCount = properties.filter(
        (property) =>
            property.status === "UNAVAILABLE",
    ).length;

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Your properties could not be loaded.";

    return (
        <section aria-labelledby="landlord-properties-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-accent-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            Property management
                        </span>

                        <h1
                            id="landlord-properties-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Manage every listing,
                            <span className="block text-brand">
                                status, and detail.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Review availability, pricing, property details,
                            and management actions across all your rental
                            listings.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/landlord/properties/new"
                        className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                    >
                        <Plus
                            aria-hidden="true"
                            className="size-4"
                        />

                        Add property
                    </Link>
                </div>
            </header>

            {isFetching && !isLoading && (
                <div
                    role="status"
                    className="mt-5 flex w-fit items-center gap-2 rounded-full bg-info-soft px-3.5 py-2 text-xs font-bold text-info"
                >
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-3.5 animate-spin"
                    />

                    Updating properties
                </div>
            )}

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="h-44 animate-pulse rounded-[1.5rem] border border-border bg-surface-muted"
                            />
                        ))}
                    </div>

                    <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }, (_, index) => (
                            <PropertyListSkeleton key={index} />
                        ))}
                    </div>
                </>
            ) : error ? (
                <div
                    role="alert"
                    className="mt-8 rounded-[2rem] border border-danger/20 bg-surface p-8 text-center shadow-soft sm:p-12"
                >
                    <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-danger-soft text-danger">
                        <RefreshCw
                            aria-hidden="true"
                            className={`size-7 ${isFetching ? "animate-spin" : ""
                                }`}
                        />
                    </span>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                        Properties unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Properties could not be loaded
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isFetching
                            ? "Trying again"
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <PropertySummary
                            label="Total properties"
                            value={properties.length}
                            description="Every rental property owned by your account."
                            icon={Building2}
                            tone="brand"
                        />

                        <PropertySummary
                            label="Available"
                            value={availableCount}
                            description="Properties currently accepting tenant requests."
                            icon={CircleCheck}
                            tone="success"
                        />

                        <PropertySummary
                            label="Rented"
                            value={rentedCount}
                            description="Properties connected to an active rental."
                            icon={House}
                            tone="info"
                        />

                        <PropertySummary
                            label="Unavailable"
                            value={unavailableCount}
                            description="Listings currently hidden from new requests."
                            icon={CircleOff}
                            tone="neutral"
                        />
                    </div>

                    {properties.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                Build your portfolio
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                You have not listed any properties
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
                                Create your first property listing to begin
                                receiving and managing tenant rental requests.
                            </p>

                            <Link
                                href="/dashboard/landlord/properties/new"
                                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                            >
                                <Plus
                                    aria-hidden="true"
                                    className="size-4"
                                />

                                Create your first property
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
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