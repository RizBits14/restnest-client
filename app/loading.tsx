import {
    Building2,
    LoaderCircle,
} from "lucide-react";

export default function Loading() {
    return (
        <section
            role="status"
            aria-live="polite"
            className="flex min-h-[70svh] items-center justify-center px-4 py-16"
        >
            <div className="w-full max-w-md rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-10">
                <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                    <Building2
                        aria-hidden="true"
                        className="size-7"
                    />
                </span>

                <LoaderCircle
                    aria-hidden="true"
                    className="mx-auto mt-6 size-6 animate-spin text-brand"
                />

                <h1 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                    Preparing your RESTNEST experience
                </h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Loading the latest properties and rental
                    information.
                </p>

                <span className="sr-only">
                    Page content is loading.
                </span>
            </div>
        </section>
    );
}