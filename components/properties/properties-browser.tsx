"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Building2,
    LoaderCircle,
    RefreshCw,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";
import { PropertyFilterForm } from "@/components/properties/property-filter-form";
import { ApiError } from "@/lib/api/api-client";
import { getCategories } from "@/lib/api/categories";
import {
    getProperties,
    type PropertyFilters,
} from "@/lib/api/properties";
import type { PropertyFilterFormValues } from "@/lib/validation/property-filter-schema";

function createAppliedFilters(
    values: PropertyFilterFormValues,
): PropertyFilters {
    return {
        location: values.location || undefined,
        categoryId: values.categoryId || undefined,
        minPrice: values.minPrice
            ? Number(values.minPrice)
            : undefined,
        maxPrice: values.maxPrice
            ? Number(values.maxPrice)
            : undefined,
    };
}

function getActiveFilterCount(
    filters: PropertyFilters,
) {
    return Object.values(filters).filter(
        (value) => value !== undefined,
    ).length;
}

function getRequestErrorMessage(
    error: unknown,
    fallbackMessage: string,
) {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
}

export function PropertiesBrowser() {
    const [appliedFilters, setAppliedFilters] =
        useState<PropertyFilters>({});

    const {
        data: categories = [],
        error: categoriesError,
        isPending: isCategoriesPending,
        isFetching: isCategoriesFetching,
    } = useQuery({
        queryKey: ["property-categories"],
        queryFn: getCategories,
    });

    const {
        data: properties = [],
        error: propertiesError,
        isPending: isPropertiesPending,
        isFetching: isPropertiesFetching,
        refetch,
    } = useQuery({
        queryKey: [
            "properties",
            "browse",
            "available",
            appliedFilters,
        ],
        queryFn: () =>
            getProperties({
                ...appliedFilters,
                status: "AVAILABLE",
            }),

        // Keep the existing property cards visible while
        // a new filter combination is being requested.
        placeholderData: (previousData) =>
            previousData,

        // Always verify the available-property list when
        // this component mounts.
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const activeFilterCount =
        getActiveFilterCount(appliedFilters);

    const isInitialLoading =
        isPropertiesPending &&
        properties.length === 0;

    const isRefreshing =
        isPropertiesFetching &&
        !isInitialLoading;

    const isPageDataFetching =
        isPropertiesFetching ||
        isCategoriesFetching;

    const propertiesErrorMessage =
        getRequestErrorMessage(
            propertiesError,
            "Available properties could not be loaded.",
        );

    const categoryErrorMessage = categoriesError
        ? getRequestErrorMessage(
            categoriesError,
            "Property types could not be loaded.",
        )
        : undefined;

    const loadingTitle = isInitialLoading
        ? "Loading available properties"
        : isPropertiesFetching
            ? "Refreshing property results"
            : "Refreshing property filters";

    const loadingDescription = isInitialLoading
        ? "Please wait while RESTNEST retrieves the latest available listings."
        : isPropertiesFetching
            ? "The currently displayed listings will update when the latest results arrive."
            : "RESTNEST is updating the available property categories.";

    function handleApplyFilters(
        values: PropertyFilterFormValues,
    ) {
        setAppliedFilters(
            createAppliedFilters(values),
        );
    }

    function handleResetFilters() {
        setAppliedFilters({});
    }

    return (
        <section
            aria-labelledby="properties-page-title"
            className="bg-background py-14 sm:py-18 lg:py-20"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-9 lg:p-11">
                    <div
                        aria-hidden="true"
                        className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-brand-soft/70 lg:block"
                    />

                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            <Search
                                aria-hidden="true"
                                className="size-3.5"
                            />

                            Available rentals
                        </div>

                        <h1
                            id="properties-page-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.5rem]"
                        >
                            Find a property for your

                            <span className="block text-brand">
                                next chapter.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                            Browse available homes with
                            clear pricing, essential
                            details, and practical filters
                            that help narrow your search.
                        </p>
                    </div>
                </header>

                <div className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft">
                    <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                                <SlidersHorizontal
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <div>
                                <h2 className="font-bold text-foreground">
                                    Refine your search
                                </h2>

                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Filter by location,
                                    category, and price.
                                </p>
                            </div>
                        </div>

                        {activeFilterCount > 0 && (
                            <span className="w-fit rounded-full bg-accent-soft px-3 py-1.5 text-xs font-bold text-accent">
                                {activeFilterCount}{" "}
                                {activeFilterCount === 1
                                    ? "filter"
                                    : "filters"}{" "}
                                applied
                            </span>
                        )}
                    </div>

                    <div className="p-5 sm:p-6">
                        <PropertyFilterForm
                            categories={categories}
                            isCategoriesLoading={
                                isCategoriesPending
                            }
                            categoryErrorMessage={
                                categoryErrorMessage
                            }
                            isUpdating={isRefreshing}
                            onApply={handleApplyFilters}
                            onReset={handleResetFilters}
                        />
                    </div>
                </div>

                {isPageDataFetching && (
                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-soft px-4 py-3.5 text-brand shadow-soft sm:px-5"
                    >
                        <LoaderCircle
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 animate-spin"
                        />

                        <div>
                            <p className="text-sm font-bold">
                                {loadingTitle}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-brand/80">
                                {loadingDescription}
                            </p>
                        </div>
                    </div>
                )}

                <div
                    aria-busy={isPageDataFetching}
                    className="mt-10"
                >
                    {isInitialLoading ? (
                        <div
                            role="status"
                            aria-label="Loading available properties"
                            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {Array.from(
                                { length: 6 },
                                (_, index) => (
                                    <PropertyCardSkeleton
                                        key={index}
                                    />
                                ),
                            )}

                            <span className="sr-only">
                                Available properties are
                                loading.
                            </span>
                        </div>
                    ) : propertiesError ? (
                        <div
                            role="alert"
                            className="rounded-[2rem] border border-danger/20 bg-surface p-7 shadow-soft sm:p-10"
                        >
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger-soft text-danger">
                                        <RefreshCw
                                            aria-hidden="true"
                                            className={`size-6 ${isPropertiesFetching
                                                    ? "animate-spin"
                                                    : ""
                                                }`}
                                        />
                                    </span>

                                    <div>
                                        <h2 className="text-xl font-bold tracking-[-0.025em] text-foreground">
                                            Properties could
                                            not be loaded
                                        </h2>

                                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                            {
                                                propertiesErrorMessage
                                            }
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        void refetch()
                                    }
                                    disabled={
                                        isPropertiesFetching
                                    }
                                    className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                                >
                                    {isPropertiesFetching && (
                                        <LoaderCircle
                                            aria-hidden="true"
                                            className="size-4 animate-spin"
                                        />
                                    )}

                                    {isPropertiesFetching
                                        ? "Trying again"
                                        : "Try again"}
                                </button>
                            </div>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="rounded-[2rem] border border-border bg-surface p-7 text-center shadow-soft sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                No results this time
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                No matching properties
                                found
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
                                Try changing or clearing
                                your filters. New listings
                                will appear here when
                                landlords make them
                                available.
                            </p>

                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={
                                        handleResetFilters
                                    }
                                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface-subtle px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                >
                                    Clear applied filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div
                                aria-live="polite"
                                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                            >
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-bold text-foreground">
                                        {properties.length}
                                    </span>{" "}
                                    {properties.length === 1
                                        ? "property"
                                        : "properties"}{" "}
                                    available
                                </p>

                                {isRefreshing && (
                                    <p className="inline-flex items-center gap-2 text-sm font-bold text-brand">
                                        <LoaderCircle
                                            aria-hidden="true"
                                            className="size-4 animate-spin"
                                        />

                                        Updating results
                                    </p>
                                )}
                            </div>

                            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {properties.map(
                                    (property) => (
                                        <PropertyCard
                                            key={
                                                property.id
                                            }
                                            property={
                                                property
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}