"use client";

import {
    ArrowRight,
    House,
    RefreshCw,
    ServerCrash,
    ShieldAlert,
    TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import "./globals.css";

type GlobalErrorPageProps = Readonly<{
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}>;

export default function GlobalErrorPage({
    error,
    reset,
}: GlobalErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-svh bg-background font-sans text-foreground antialiased">
                <title>Application Error | RESTNEST</title>

                <section
                    role="alert"
                    aria-labelledby="global-error-title"
                    className="flex min-h-svh items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
                >
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-danger/20 bg-surface shadow-raised">
                        <div
                            aria-hidden="true"
                            className="absolute left-0 top-16 h-40 w-6 rounded-r-full bg-danger-soft"
                        />

                        <div
                            aria-hidden="true"
                            className="absolute bottom-16 right-0 h-28 w-6 rounded-l-full bg-warning-soft"
                        />

                        <div className="relative border-b border-border bg-danger-soft px-6 py-8 text-center sm:px-10 sm:py-10">
                            <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] bg-danger text-danger-foreground shadow-soft">
                                <ServerCrash
                                    aria-hidden="true"
                                    className="size-9"
                                    strokeWidth={1.8}
                                />
                            </span>

                            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-danger">
                                RESTNEST system error
                            </p>

                            <h1
                                id="global-error-title"
                                className="mt-3 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl"
                            >
                                The application could not load
                            </h1>

                            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                                A critical application error interrupted
                                RESTNEST. Reload the application first, or
                                return to the home page and try again.
                            </p>
                        </div>

                        <div className="relative p-6 sm:p-8">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                                        <TriangleAlert
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">
                                            Temporary interruption
                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Reloading may immediately restore the
                                            application.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-info-soft text-info">
                                        <ShieldAlert
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <div>
                                        <h2 className="text-sm font-bold text-foreground">
                                            Safe recovery
                                        </h2>

                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Returning home will start a fresh
                                            navigation session.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error.digest && (
                                <div className="mt-5 rounded-xl border border-border bg-surface-subtle px-4 py-3 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        Error reference
                                    </p>

                                    <code className="mt-1 block break-all font-mono text-xs font-bold text-foreground">
                                        {error.digest}
                                    </code>
                                </div>
                            )}

                            <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                                >
                                    <RefreshCw
                                        aria-hidden="true"
                                        className="size-4"
                                    />

                                    Reload application
                                </button>

                                <Link
                                    href="/"
                                    className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                >
                                    <House
                                        aria-hidden="true"
                                        className="size-4 text-brand"
                                    />

                                    Return home

                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                </Link>
                            </div>

                            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                                Provide the error reference to the RESTNEST
                                administrator when the problem continues.
                            </p>
                        </div>
                    </div>
                </section>
            </body>
        </html>
    );
}