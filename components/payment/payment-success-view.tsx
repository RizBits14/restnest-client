"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    CheckCircle2,
    LoaderCircle,
    Search,
} from "lucide-react";
import Link from "next/link";
import {
    useEffect,
    useState,
} from "react";

import {
    getTenantRentals,
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";

const synchronizationAttempts = 6;
const synchronizationDelay = 2000;

function wait(milliseconds: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

export function PaymentSuccessView() {
    const queryClient = useQueryClient();

    const [isSynchronizing, setIsSynchronizing] =
        useState(true);

    useEffect(() => {
        let isCancelled = false;

        async function synchronizeRentals() {
            for (
                let attempt = 0;
                attempt < synchronizationAttempts;
                attempt += 1
            ) {
                if (isCancelled) {
                    return;
                }

                try {
                    await queryClient.fetchQuery({
                        queryKey: tenantRentalsQueryKey,
                        queryFn: getTenantRentals,
                        staleTime: 0,
                    });
                } catch {
                    if (!isCancelled) {
                        await queryClient.invalidateQueries({
                            queryKey: tenantRentalsQueryKey,
                        });
                    }
                }

                if (
                    attempt <
                    synchronizationAttempts - 1
                ) {
                    await wait(synchronizationDelay);
                }
            }

            if (!isCancelled) {
                setIsSynchronizing(false);
            }
        }

        void synchronizeRentals();

        return () => {
            isCancelled = true;
        };
    }, [queryClient]);

    return (
        <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
            <section className="w-full rounded-[2rem] border border-border bg-surface p-6 text-center shadow-[0_24px_70px_rgba(25,35,29,0.08)] sm:p-10">
                <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] border border-emerald-700/20 bg-emerald-100 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200">
                    <CheckCircle2
                        aria-hidden="true"
                        className="size-9"
                    />
                </span>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Stripe checkout completed
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    Payment submitted
                </h1>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                    Stripe has received your payment. RESTNEST
                    is now checking the latest payment and rental
                    status.
                </p>

                <div
                    role="status"
                    className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm text-muted-foreground"
                >
                    {isSynchronizing ? (
                        <>
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin text-brand"
                            />
                            Synchronizing your rental status...
                        </>
                    ) : (
                        <>
                            <CheckCircle2
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Status synchronization finished.
                        </>
                    )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/dashboard/tenant/rentals"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        View my rentals
                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>

                    <Link
                        href="/properties"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        Browse properties
                        <Search
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                    </Link>
                </div>

                <p className="mt-6 text-xs leading-5 text-muted-foreground">
                    Payment confirmation may take a few seconds
                    while Stripe processes the webhook.
                </p>
            </section>
        </main>
    );
}