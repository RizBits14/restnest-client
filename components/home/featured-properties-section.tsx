"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Building2,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";
import { ApiError } from "@/lib/api/api-client";
import { getProperties } from "@/lib/api/properties";

export function FeaturedPropertiesSection() {
    const {
        data: properties = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["properties", "featured"],
        queryFn: () =>
            getProperties({
                status: "AVAILABLE",
            }),
    });

    const featuredProperties = properties.slice(0, 3);

    const errorMessage =
        error instanceof ApiError
            ? error.message
            : "Featured properties could not be loaded.";

    return (
        <section className="border-b border-border py-20 sm:py-24">
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                            Featured properties
                        </p>

                        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
                            Spaces selected for a simpler rental journey.
                        </h2>

                        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                            Explore currently available listings with clear pricing,
                            location details, and essential property information.
                        </p>
                    </div>

                    <Link
                        href="/properties"
                        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand transition-opacity duration-200 hover:opacity-75"
                    >
                        Browse all properties
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 3 }, (_, index) => (
                            <PropertyCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-muted text-brand">
                            <RefreshCw aria-hidden="true" className="size-6" />
                        </span>

                        <h3 className="mt-5 text-xl font-semibold text-foreground">
                            Properties could not be loaded
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                        >
                            {isFetching ? "Trying again..." : "Try again"}
                        </button>
                    </div>
                ) : featuredProperties.length === 0 ? (
                    <div className="mt-10 grid gap-8 rounded-[2rem] border border-border bg-surface p-7 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                        <span className="grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                            <Building2 aria-hidden="true" className="size-7" />
                        </span>

                        <div>
                            <h3 className="text-xl font-semibold tracking-[-0.025em] text-foreground">
                                No properties are available yet
                            </h3>

                            <p className="mt-2 max-w-xl leading-7 text-muted-foreground">
                                New rental listings will appear here automatically when
                                landlords publish available properties.
                            </p>
                        </div>

                        <Link
                            href="/auth/register"
                            className="inline-flex h-11 w-fit items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                        >
                            Become a landlord
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {featuredProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}