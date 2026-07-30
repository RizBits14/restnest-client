"use client";

import {
    Building2,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";
import { ApiError } from "@/lib/api/api-client";
import { getProperties } from "@/lib/api/properties";

export function PropertiesBrowser() {
    const {
        data: properties = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["properties", "browse", "available"],
        queryFn: () =>
            getProperties({
                status: "AVAILABLE",
            }),
    });

    const errorMessage =
        error instanceof ApiError
            ? error.message
            : "Available properties could not be loaded.";

    return (
        <section className="py-14 sm:py-18 lg:py-20">
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="border-b border-border pb-9">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Available rentals
                    </p>

                    <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Find the property that fits your next chapter.
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Browse currently available properties with transparent pricing
                        and essential rental information.
                    </p>
                </div>

                {isLoading ? (
                    <div
                        aria-label="Loading available properties"
                        className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {Array.from({ length: 6 }, (_, index) => (
                            <PropertyCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
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
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                        >
                            {isFetching ? "Trying again..." : "Try again"}
                        </button>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="mt-10 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                        <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                            <Building2 aria-hidden="true" className="size-7" />
                        </span>

                        <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                            No available properties found
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
                            New listings will appear here once landlords make their
                            properties available.
                        </p>

                        <Link
                            href="/auth/register"
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                        >
                            List a property
                        </Link>
                    </div>
                ) : (
                    <>
                        <div
                            aria-live="polite"
                            className="mt-8 flex items-center justify-between gap-4"
                        >
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    {properties.length}
                                </span>{" "}
                                {properties.length === 1 ? "property" : "properties"} available
                            </p>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    property={property}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}