import {
    Building2,
    LoaderCircle,
} from "lucide-react";

import { PropertyCardSkeleton } from "@/components/properties/property-card-skeleton";

export default function PropertiesLoading() {
    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading available properties"
            className="py-14 sm:py-18 lg:py-20"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="border-b border-border pb-9">
                    <div className="flex items-center gap-2 text-brand">
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin"
                        />

                        <p className="text-sm font-bold uppercase tracking-[0.18em]">
                            Loading available rentals
                        </p>
                    </div>

                    <div className="mt-4 h-12 w-full max-w-3xl animate-pulse rounded-xl bg-surface-muted sm:h-14" />

                    <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-lg bg-surface-muted" />

                    <div className="mt-2 h-5 w-3/5 max-w-lg animate-pulse rounded-lg bg-surface-muted" />
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
                    <div className="flex items-center gap-3">
                        <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                            <Building2
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div>
                            <p className="text-sm font-bold text-foreground">
                                Preparing property filters
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Loading categories and available listings.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="h-12 animate-pulse rounded-xl bg-surface-muted"
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <PropertyCardSkeleton key={index} />
                    ))}
                </div>

                <span className="sr-only">
                    Available properties are currently loading.
                </span>
            </div>
        </section>
    );
}