import {
    ArrowRight,
    Building2,
    Compass,
    House,
    MapPinOff,
    SearchX,
} from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <section
            aria-labelledby="not-found-title"
            className="flex min-h-[70svh] items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
        >
            <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised">
                <div
                    aria-hidden="true"
                    className="absolute left-0 top-20 h-36 w-6 rounded-r-full bg-brand-soft"
                />

                <div
                    aria-hidden="true"
                    className="absolute bottom-16 right-0 h-28 w-6 rounded-l-full bg-accent-soft"
                />

                <div className="relative border-b border-border bg-surface-subtle px-6 py-9 text-center sm:px-10 sm:py-12">
                    <div className="relative mx-auto w-fit">
                        <span className="grid size-20 place-items-center rounded-[1.6rem] bg-brand-soft text-brand">
                            <SearchX
                                aria-hidden="true"
                                className="size-9"
                                strokeWidth={1.8}
                            />
                        </span>

                        <span
                            aria-hidden="true"
                            className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-xl border-4 border-surface-subtle bg-accent text-accent-foreground"
                        >
                            <MapPinOff className="size-4" />
                        </span>
                    </div>

                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-brand">
                        Error 404
                    </p>

                    <h1
                        id="not-found-title"
                        className="mt-3 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        This page cannot be found
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                        The address may be incorrect, or the page may
                        have been moved or removed. Continue exploring
                        RESTNEST from one of the destinations below.
                    </p>
                </div>

                <div className="relative p-6 sm:p-8">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <article className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5">
                            <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <h2 className="mt-4 text-sm font-bold text-foreground">
                                Browse rental properties
                            </h2>

                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                Search available homes and continue your
                                property discovery journey.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5">
                            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                                <Compass
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <h2 className="mt-4 text-sm font-bold text-foreground">
                                Return to RESTNEST
                            </h2>

                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                Go back to the homepage and restart your
                                navigation.
                            </p>
                        </article>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <Link
                            href="/properties"
                            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            Browse properties

                            <ArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                        >
                            <House
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />

                            Return home
                        </Link>
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                        Check the URL for spelling errors when you
                        reached this page through a saved link.
                    </p>
                </div>
            </div>
        </section>
    );
}