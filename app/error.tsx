"use client";

import {
    ArrowRight,
    House,
    RefreshCw,
    ShieldAlert,
    TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = Readonly<{
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}>;

export default function ErrorPage({
    error,
    reset,
}: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section
            role="alert"
            aria-labelledby="application-error-title"
            className="flex min-h-[70svh] items-center justify-center px-4 py-12 sm:px-6 sm:py-16"
        >
            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-danger/20 bg-surface shadow-raised">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-12 h-36 w-6 rounded-l-full bg-danger-soft"
                />

                <div className="border-b border-border bg-danger-soft px-6 py-8 text-center sm:px-10 sm:py-10">
                    <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] bg-danger text-danger-foreground shadow-soft">
                        <TriangleAlert
                            aria-hidden="true"
                            className="size-9"
                            strokeWidth={1.8}
                        />
                    </span>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-danger">
                        Unexpected application error
                    </p>

                    <h1
                        id="application-error-title"
                        className="mt-3 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        Something went wrong
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
                        RESTNEST could not finish loading this page.
                        The issue may be temporary, so you can retry
                        without leaving your current location.
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                            <ShieldAlert
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                Your information remains protected
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Retry the page first. You can safely return
                                home if the problem continues.
                            </p>
                        </div>
                    </div>

                    {error.digest && (
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            Error reference:{" "}
                            <code className="rounded-md bg-surface-muted px-2 py-1 font-mono text-foreground">
                                {error.digest}
                            </code>
                        </p>
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

                            Try again
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
                        Contact the RESTNEST administrator and provide
                        the error reference when the issue repeatedly
                        occurs.
                    </p>
                </div>
            </div>
        </section>
    );
}