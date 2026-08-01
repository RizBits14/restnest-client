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
        <section
            aria-labelledby="featured-properties-title"
            className="border-b border-border bg-surface-subtle py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">

                        <h2
                            id="featured-properties-title"
                            className="mt-5 text-3xl font-bold leading-tight tracking-[-0.045em] text-foreground sm:text-4xl lg:text-[2.75rem]"
                        >
                            Thoughtfully presented homes,
                            <span className="block text-brand">
                                ready to explore.
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                            Browse currently available listings with clear
                            pricing, useful location details, and the property
                            information you need before making a request.
                        </p>
                    </div>

                    <Link
                        href="/properties"
                        className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/35 hover:bg-brand-soft hover:text-brand"
                    >
                        Browse all properties

                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>
                </div>

                {isLoading ? (
                    <div
                        aria-label="Loading featured properties"
                        className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {Array.from({ length: 3 }, (_, index) => (
                            <PropertyCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="mt-10 rounded-[2rem] border border-danger/20 bg-surface p-7 shadow-soft sm:p-10"
                    >
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger-soft text-danger">
                                    <RefreshCw
                                        aria-hidden="true"
                                        className={`size-6 ${isFetching ? "animate-spin" : ""
                                            }`}
                                    />
                                </span>

                                <div>
                                    <h3 className="text-xl font-bold tracking-[-0.025em] text-foreground">
                                        Properties could not be loaded
                                    </h3>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => void refetch()}
                                disabled={isFetching}
                                className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                            >
                                {isFetching && (
                                    <RefreshCw
                                        aria-hidden="true"
                                        className="size-4 animate-spin"
                                    />
                                )}

                                {isFetching ? "Trying again" : "Try again"}
                            </button>
                        </div>
                    </div>
                ) : featuredProperties.length === 0 ? (
                    <div className="mt-10 rounded-[2rem] border border-border bg-surface p-7 shadow-soft sm:p-10">
                        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
                            <span className="grid size-16 place-items-center rounded-[1.35rem] bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                    Fresh listings coming soon
                                </p>

                                <h3 className="mt-2 text-xl font-bold tracking-[-0.025em] text-foreground">
                                    No properties are available yet
                                </h3>

                                <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                                    New rental listings will appear here
                                    automatically when landlords publish available
                                    properties.
                                </p>
                            </div>

                            <Link
                                href="/auth/register"
                                className="inline-flex min-h-11 w-fit items-center justify-center rounded-xl border border-border bg-surface-subtle px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-accent/35 hover:bg-accent-soft hover:text-accent"
                            >
                                Become a landlord
                            </Link>
                        </div>
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