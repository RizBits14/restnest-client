import {
    ArrowRight,
    House,
    SearchX,
} from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <section className="flex min-h-[70svh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-2xl rounded-[2rem] border border-border bg-surface p-8 text-center shadow-[0_24px_70px_rgba(25,35,29,0.08)] sm:p-12">
                <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] bg-surface-muted text-brand">
                    <SearchX
                        aria-hidden="true"
                        className="size-9"
                    />
                </span>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Error 404
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    This page cannot be found
                </h1>

                <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
                    The address may be incorrect, or the page
                    may have been moved or removed from
                    RESTNEST.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/properties"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        Browse properties
                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        <House
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                        Return home
                    </Link>
                </div>
            </div>
        </section>
    );
}