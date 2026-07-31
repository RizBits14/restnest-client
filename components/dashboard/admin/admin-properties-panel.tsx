"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Bath,
    BedDouble,
    Building2,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    House,
    Mail,
    MapPin,
    Maximize2,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
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

const currencyFormatter =
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

const dateFormatter =
    new Intl.DateTimeFormat("en-US", {
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
    AVAILABLE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    RENTED:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    UNAVAILABLE:
        "border-zinc-600/25 bg-zinc-200 text-zinc-900 dark:border-zinc-400/30 dark:bg-zinc-800 dark:text-zinc-100",
};

const accountStatusStyles: Record<
    UserStatus,
    string
> = {
    ACTIVE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    BANNED:
        "border-red-700/25 bg-red-100 text-red-900 dark:border-red-400/30 dark:bg-red-950 dark:text-red-200",
};

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    icon: typeof Building2;
}>;

function SummaryCard({
    label,
    value,
    icon: Icon,
}: SummaryCardProps) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
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

function PropertyCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="aspect-[16/9] animate-pulse bg-surface-muted" />

            <div className="space-y-4 p-5">
                <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-20 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
            </div>
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
        property.images.find(
            (imageUrl) => imageUrl.trim(),
        ) ?? null;

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={
                        primaryImageUrl ??
                        "property-placeholder"
                    }
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${property.title}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                />

                <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${propertyStatusStyles[property.status]}`}
                >
                    {propertyStatusLabels[
                        property.status
                    ]}
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
                            {currencyFormatter.format(
                                property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Total payment
                        </p>
                    </div>
                </div>

                {property.address && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {property.address}
                    </p>
                )}

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

                <div className="mt-5 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                                <UserRound
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {property.landlord.name}
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                                    <Mail
                                        aria-hidden="true"
                                        className="size-3.5 shrink-0"
                                    />
                                    {property.landlord.email}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${accountStatusStyles[property.landlord.status]}`}
                        >
                            {property.landlord.status ===
                                "ACTIVE"
                                ? "Active"
                                : "Banned"}
                        </span>
                    </div>

                    {property.landlord.phone && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Phone: {property.landlord.phone}
                        </p>
                    )}
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

                <Link
                    href={`/properties/${property.id}`}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                >
                    Inspect property
                    <ExternalLink
                        aria-hidden="true"
                        className="size-4 text-brand"
                    />
                </Link>
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
    ] = useState<PropertyStatus | "ALL">(
        "ALL",
    );

    const [
        categoryFilter,
        setCategoryFilter,
    ] = useState("ALL");

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

    const filteredProperties =
        properties.filter((property) => {
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
                property.status ===
                propertyStatusFilter;

            const matchesCategory =
                categoryFilter === "ALL" ||
                property.category.id ===
                categoryFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory
            );
        });

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredProperties.length /
            pageSize,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) *
        pageSize;

    const visibleProperties =
        filteredProperties.slice(
            startIndex,
            startIndex + pageSize,
        );

    const availableCount =
        properties.filter(
            (property) =>
                property.status === "AVAILABLE",
        ).length;

    const rentedCount = properties.filter(
        (property) =>
            property.status === "RENTED",
    ).length;

    const unavailableCount =
        properties.filter(
            (property) =>
                property.status ===
                "UNAVAILABLE",
        ).length;

    function resetPage() {
        setCurrentPage(1);
    }

    const errorMessage =
        error instanceof Error
            ? error.message
            : "The property list could not be loaded.";

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Marketplace inspection
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Inspect properties
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Review every property listing,
                        availability status, category, and
                        landlord account.
                    </p>
                </div>

                {isFetching && !isLoading && (
                    <p
                        role="status"
                        className="text-sm font-medium text-brand"
                    >
                        Updating properties...
                    </p>
                )}
            </div>

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from(
                            { length: 4 },
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-32 animate-pulse rounded-2xl border border-border bg-surface-muted"
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from(
                            { length: 6 },
                            (_, index) => (
                                <PropertyCardSkeleton
                                    key={index}
                                />
                            ),
                        )}
                    </div>
                </>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-7 text-brand"
                    />

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
                        {isFetching
                            ? "Trying again..."
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            icon={Building2}
                        />

                        <SummaryCard
                            label="Available"
                            value={availableCount}
                            icon={House}
                        />

                        <SummaryCard
                            label="Rented"
                            value={rentedCount}
                            icon={ShieldCheck}
                        />

                        <SummaryCard
                            label="Unavailable"
                            value={unavailableCount}
                            icon={Building2}
                        />
                    </div>

                    <div className="mt-8 rounded-[2rem] border border-border bg-surface p-5">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
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
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                                />
                            </div>

                            <select
                                value={
                                    propertyStatusFilter
                                }
                                onChange={(event) => {
                                    setPropertyStatusFilter(
                                        event.target.value as
                                        | PropertyStatus
                                        | "ALL",
                                    );
                                    resetPage();
                                }}
                                aria-label="Filter by property status"
                                className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-focus"
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
                                className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-focus"
                            >
                                <option value="ALL">
                                    All categories
                                </option>

                                {categoryOptions.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>

                    {visibleProperties.length ===
                        0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-10 text-center">
                            <Building2
                                aria-hidden="true"
                                className="mx-auto size-8 text-brand"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-foreground">
                                No properties found
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Try changing the search or
                                filter values.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {visibleProperties.map(
                                (property) => (
                                    <AdminPropertyCard
                                        key={property.id}
                                        property={property}
                                    />
                                ),
                            )}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing{" "}
                            {filteredProperties.length === 0
                                ? 0
                                : startIndex + 1}
                            –
                            {Math.min(
                                startIndex + pageSize,
                                filteredProperties.length,
                            )}{" "}
                            of {filteredProperties.length}
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
                                disabled={
                                    safeCurrentPage === 1
                                }
                                aria-label="Previous page"
                                className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </button>

                            <span className="min-w-24 text-center text-sm font-medium text-foreground">
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
                                    safeCurrentPage ===
                                    totalPages
                                }
                                aria-label="Next page"
                                className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
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