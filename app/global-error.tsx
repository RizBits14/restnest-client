"use client";

import {
    House,
    RefreshCw,
    TriangleAlert,
} from "lucide-react";

import "./globals.css";

import Link from "next/link";

type GlobalErrorPageProps = Readonly<{
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}>;

export default function GlobalErrorPage({
    reset,
}: GlobalErrorPageProps) {
    return (
        <html lang="en">
            <body className="bg-background text-foreground">
                <section className="flex min-h-svh items-center justify-center px-4 py-16">
                    <div className="w-full max-w-xl rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-10">
                        <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] border border-red-700/20 bg-red-100 text-red-800">
                            <TriangleAlert
                                aria-hidden="true"
                                className="size-9"
                            />
                        </span>

                        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                            RESTNEST system error
                        </p>

                        <title>Application Error | RESTNEST</title>

                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                            The application encountered an error
                        </h1>

                        <p className="mx-auto mt-4 max-w-md leading-7 text-muted-foreground">
                            RESTNEST could not load correctly.
                            Reload the application or return to the
                            home page.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={reset}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                            >
                                <RefreshCw
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Reload application
                            </button>

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
            </body>
        </html>
    );
}