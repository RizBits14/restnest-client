"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Bath,
    BedDouble,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    CircleOff,
    ExternalLink,
    FilterX,
    House,
    LoaderCircle,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    RefreshCw,
    Search,
    UserRound,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PropertyImage } from "@/components/properties/property-image";
import {
    adminPropertiesQueryKey,
    getAdminProperties,
} from "@/lib/api/admin-properties-client";
import type { AdminProperty } from "@/types/admin";
import type { UserStatus } from "@/types/auth";
import type { PropertyStatus } from "@/types/property";

const pageSize = 6;

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const propertyStatusLabels: Record<
    PropertyStatus,
    string
> = {
    AVAILABLE: "Available",
    RENTED: "Rented",
    UNAVAILABLE: "Unavailable",
};

const propertyStatusStyles: Record<
    PropertyStatus,
    string
> = {
    AVAILABLE: "bg-success-soft text-success",
    RENTED: "bg-info-soft text-info",
    UNAVAILABLE:
        "bg-surface-muted text-muted-foreground",
};

const accountStatusLabels: Record<
    UserStatus,
    string
> = {
    ACTIVE: "Active",
    BANNED: "Banned",
};

const accountStatusStyles: Record<
    UserStatus,
    string
> = {
    ACTIVE: "bg-success-soft text-success",
    BANNED: "bg-danger-soft text-danger",
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

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone: SummaryTone;
}>;

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: SummaryCardProps) {
    const visualStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${visualStyle.icon}`}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
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

function PropertyCardSkeleton() {
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

                <div className="h-28 animate-pulse rounded-2xl bg-surface-muted" />

                <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        </div>
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

type AdminPropertyCardProps = Readonly<{
    property: AdminProperty;
}>;

function AdminPropertyCard({
    property,
}: AdminPropertyCardProps) {
    const primaryImageUrl =
        property.images.find((imageUrl) =>
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
                        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm ${propertyStatusStyles[property.status]}`}
                    >
                        {propertyStatusLabels[property.status]}
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
                            {currencyFormatter.format(
                                property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            Total
                        </p>
                    </div>
                </div>

                {property.address && (
                    <p className="mt-4 line-clamp-2 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm leading-6 text-muted-foreground">
                        {property.address}
                    </p>
                )}

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

                <div className="mt-5 rounded-2xl border border-border bg-surface-subtle p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                                <UserRound
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[0.64rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                    Property landlord
                                </p>

                                <p className="mt-1 truncate text-sm font-bold text-foreground">
                                    {property.landlord.name}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${accountStatusStyles[property.landlord.status]}`}
                        >
                            {accountStatusLabels[
                                property.landlord.status
                            ]}
                        </span>
                    </div>

                    <div className="mt-4 space-y-2.5 border-t border-border pt-4">
                        <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                            <Mail
                                aria-hidden="true"
                                className="mt-0.5 size-3.5 shrink-0 text-brand"
                            />

                            <span className="break-all">
                                {property.landlord.email}
                            </span>
                        </p>

                        {property.landlord.phone && (
                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone
                                    aria-hidden="true"
                                    className="size-3.5 shrink-0 text-brand"
                                />

                                {property.landlord.phone}
                            </p>
                        )}
                    </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays
                        aria-hidden="true"
                        className="size-4 text-brand"
                    />

                    Listed{" "}
                    {dateFormatter.format(
                        new Date(property.createdAt),
                    )}
                </p>

                <div className="mt-auto pt-5">
                    <Link
                        href={`/properties/${property.id}`}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                    >
                        Inspect property

                        <ExternalLink
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export function AdminPropertiesPanel() {
    const [searchValue, setSearchValue] =
        useState("");

    const [
        propertyStatusFilter,
        setPropertyStatusFilter,
    ] = useState<PropertyStatus | "ALL">("ALL");

    const [categoryFilter, setCategoryFilter] =
        useState("ALL");

    const [currentPage, setCurrentPage] =
        useState(1);

    const {
        data: properties = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: adminPropertiesQueryKey,
        queryFn: getAdminProperties,
    });

    const categoryOptions = Array.from(
        new Map(
            properties.map((property) => [
                property.category.id,
                property.category,
            ]),
        ).values(),
    ).sort((firstCategory, secondCategory) =>
        firstCategory.name.localeCompare(
            secondCategory.name,
        ),
    );

    const normalizedSearch =
        searchValue.trim().toLowerCase();

    const filteredProperties = properties.filter(
        (property) => {
            const searchableValues = [
                property.title,
                property.location,
                property.address ?? "",
                property.category.name,
                property.landlord.name,
                property.landlord.email,
            ];

            const matchesSearch =
                !normalizedSearch ||
                searchableValues.some((value) =>
                    value
                        .toLowerCase()
                        .includes(normalizedSearch),
                );

            const matchesStatus =
                propertyStatusFilter === "ALL" ||
                property.status === propertyStatusFilter;

            const matchesCategory =
                categoryFilter === "ALL" ||
                property.category.id === categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        },
    );

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProperties.length / pageSize,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) * pageSize;

    const visibleProperties =
        filteredProperties.slice(
            startIndex,
            startIndex + pageSize,
        );

    const availableCount = properties.filter(
        (property) =>
            property.status === "AVAILABLE",
    ).length;

    const rentedCount = properties.filter(
        (property) =>
            property.status === "RENTED",
    ).length;

    const unavailableCount = properties.filter(
        (property) =>
            property.status === "UNAVAILABLE",
    ).length;

    const hasActiveFilters =
        searchValue.trim().length > 0 ||
        propertyStatusFilter !== "ALL" ||
        categoryFilter !== "ALL";

    const errorMessage =
        error instanceof Error
            ? error.message
            : "The property list could not be loaded.";

    function resetPage() {
        setCurrentPage(1);
    }

    function clearFilters() {
        setSearchValue("");
        setPropertyStatusFilter("ALL");
        setCategoryFilter("ALL");
        setCurrentPage(1);
    }

    return (
        <section aria-labelledby="admin-properties-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-warning-soft lg:block"
                />

                <div className="relative max-w-3xl">
                    <span className="inline-flex rounded-full border border-warning/20 bg-warning-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-warning">
                        Marketplace inspection
                    </span>

                    <h1
                        id="admin-properties-title"
                        className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        Inspect every listing
                        <span className="block text-brand">
                            across the marketplace.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                        Review property details, pricing,
                        availability, categories, landlord ownership,
                        and landlord account status.
                    </p>
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
                            <PropertyCardSkeleton key={index} />
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
                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            description="Every rental listing stored on RESTNEST."
                            icon={Building2}
                            tone="brand"
                        />

                        <SummaryCard
                            label="Available"
                            value={availableCount}
                            description="Properties currently accepting tenant requests."
                            icon={CircleCheck}
                            tone="success"
                        />

                        <SummaryCard
                            label="Rented"
                            value={rentedCount}
                            description="Properties connected to active rentals."
                            icon={House}
                            tone="info"
                        />

                        <SummaryCard
                            label="Unavailable"
                            value={unavailableCount}
                            description="Listings currently unavailable for new requests."
                            icon={CircleOff}
                            tone="neutral"
                        />
                    </div>

                    <article className="mt-8 rounded-[2rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                    Property directory
                                </p>

                                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                    Search and filter listings
                                </h2>

                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Search listings and narrow the results
                                    by availability or category.
                                </p>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-bold text-muted-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                >
                                    <FilterX
                                        aria-hidden="true"
                                        className="size-4"
                                    />

                                    Clear filters
                                </button>
                            )}
                        </div>

                        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
                            <div className="relative">
                                <Search
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    type="search"
                                    value={searchValue}
                                    onChange={(event) => {
                                        setSearchValue(
                                            event.target.value,
                                        );
                                        resetPage();
                                    }}
                                    placeholder="Search title, location, landlord, or category"
                                    aria-label="Search properties"
                                    className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                                />
                            </div>

                            <select
                                value={propertyStatusFilter}
                                onChange={(event) => {
                                    setPropertyStatusFilter(
                                        event.target.value as
                                        | PropertyStatus
                                        | "ALL",
                                    );
                                    resetPage();
                                }}
                                aria-label="Filter by property status"
                                className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                            >
                                <option value="ALL">
                                    All statuses
                                </option>

                                <option value="AVAILABLE">
                                    Available
                                </option>

                                <option value="RENTED">
                                    Rented
                                </option>

                                <option value="UNAVAILABLE">
                                    Unavailable
                                </option>
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={(event) => {
                                    setCategoryFilter(
                                        event.target.value,
                                    );
                                    resetPage();
                                }}
                                aria-label="Filter by category"
                                className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                            >
                                <option value="ALL">
                                    All categories
                                </option>

                                {categoryOptions.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </article>

                    {visibleProperties.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-foreground">
                                No properties found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                Adjust the search term, status, or category
                                filter to inspect different listings.
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                >
                                    <FilterX
                                        aria-hidden="true"
                                        className="size-4"
                                    />

                                    Reset filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {visibleProperties.map((property) => (
                                <AdminPropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] border border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-sm text-muted-foreground">
                            Showing{" "}
                            <strong className="font-bold text-foreground">
                                {filteredProperties.length === 0
                                    ? 0
                                    : startIndex + 1}
                                –
                                {Math.min(
                                    startIndex + pageSize,
                                    filteredProperties.length,
                                )}
                            </strong>{" "}
                            of{" "}
                            <strong className="font-bold text-foreground">
                                {filteredProperties.length}
                            </strong>
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.max(
                                            1,
                                            safeCurrentPage - 1,
                                        ),
                                    )
                                }
                                disabled={safeCurrentPage === 1}
                                aria-label="Previous page"
                                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </button>

                            <span className="min-w-28 text-center text-sm font-bold text-foreground">
                                Page {safeCurrentPage} of{" "}
                                {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        Math.min(
                                            totalPages,
                                            safeCurrentPage + 1,
                                        ),
                                    )
                                }
                                disabled={
                                    safeCurrentPage === totalPages
                                }
                                aria-label="Next page"
                                className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}