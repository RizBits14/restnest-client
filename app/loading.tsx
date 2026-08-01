import {
    Building2,
    LoaderCircle,
} from "lucide-react";

export default function Loading() {
    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading RESTNEST content"
            className="flex min-h-[70svh] items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
        >
            <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-border bg-surface p-6 text-center shadow-soft sm:p-10">
                <div
                    aria-hidden="true"
                    className="absolute left-0 top-10 h-32 w-5 rounded-r-full bg-brand-soft"
                />

                <div
                    aria-hidden="true"
                    className="absolute bottom-10 right-0 h-24 w-5 rounded-l-full bg-accent-soft"
                />

                <div className="relative">
                    <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] border border-brand/15 bg-brand-soft text-brand">
                        <Building2
                            aria-hidden="true"
                            className="size-8"
                            strokeWidth={1.8}
                        />
                    </span>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-5 animate-spin text-brand"
                        />

                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand">
                            Loading RESTNEST
                        </p>
                    </div>

                    <h1 className="mt-4 text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
                        Preparing your rental experience
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                        We are loading the latest property and rental
                        information. This should only take a moment.
                    </p>

                    <div
                        aria-hidden="true"
                        className="mx-auto mt-8 max-w-sm space-y-3"
                    >
                        <div className="h-3 animate-pulse rounded-full bg-surface-muted" />

                        <div className="mx-auto h-3 w-4/5 animate-pulse rounded-full bg-surface-muted" />

                        <div className="mx-auto h-3 w-3/5 animate-pulse rounded-full bg-surface-muted" />
                    </div>

                    <span className="sr-only">
                        Page content is currently loading.
                    </span>
                </div>
            </div>
        </section>
    );
}