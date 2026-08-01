"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    ArrowRight,
    Check,
    CheckCircle2,
    Clock3,
    CreditCard,
    LoaderCircle,
    Search,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    getTenantRentals,
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";

const synchronizationAttempts = 6;
const synchronizationDelay = 2_000;

const confirmationSteps = [
    {
        title: "Checkout completed",
        description:
            "Stripe accepted the checkout submission.",
        icon: CreditCard,
    },
    {
        title: "Payment verification",
        description:
            "RESTNEST is waiting for the secure Stripe webhook.",
        icon: ShieldCheck,
    },
    {
        title: "Rental status update",
        description:
            "Your tenant dashboard is being refreshed.",
        icon: CheckCircle2,
    },
] as const;

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
        <section
            aria-labelledby="payment-success-title"
            className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20"
        >
            <div
                aria-hidden="true"
                className="absolute left-0 top-28 hidden h-56 w-14 rounded-r-[2.5rem] bg-success-soft xl:block"
            />

            <div
                aria-hidden="true"
                className="absolute bottom-20 right-0 hidden h-44 w-14 rounded-l-[2.5rem] bg-brand-soft xl:block"
            />

            <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised">
                    <div className="border-b border-border bg-surface-subtle px-6 py-8 text-center sm:px-10 sm:py-10">
                        <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] bg-success-soft text-success">
                            <CheckCircle2
                                aria-hidden="true"
                                className="size-9"
                                strokeWidth={1.8}
                            />
                        </span>

                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-success">
                            Stripe checkout completed
                        </p>

                        <h1
                            id="payment-success-title"
                            className="mt-3 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Payment submitted
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                            Stripe has received your checkout submission.
                            RESTNEST is now refreshing your payment and
                            rental information.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="grid gap-3 md:grid-cols-3">
                            {confirmationSteps.map(
                                (step, index) => {
                                    const Icon = step.icon;
                                    const isFirstStep = index === 0;
                                    const isCurrentStep =
                                        isSynchronizing && index > 0;
                                    const isFinished =
                                        !isSynchronizing || isFirstStep;

                                    return (
                                        <article
                                            key={step.title}
                                            className={[
                                                "rounded-2xl border p-4 sm:p-5",
                                                isFinished
                                                    ? "border-success/20 bg-success-soft"
                                                    : isCurrentStep
                                                        ? "border-info/20 bg-info-soft"
                                                        : "border-border bg-surface-subtle",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <span
                                                    className={[
                                                        "grid size-10 shrink-0 place-items-center rounded-xl",
                                                        isFinished
                                                            ? "bg-success text-success-foreground"
                                                            : isCurrentStep
                                                                ? "bg-info text-info-foreground"
                                                                : "bg-surface-muted text-muted-foreground",
                                                    ].join(" ")}
                                                >
                                                    {isCurrentStep ? (
                                                        <LoaderCircle
                                                            aria-hidden="true"
                                                            className="size-[1.1rem] animate-spin"
                                                        />
                                                    ) : isFinished ? (
                                                        <Check
                                                            aria-hidden="true"
                                                            className="size-[1.1rem]"
                                                        />
                                                    ) : (
                                                        <Icon
                                                            aria-hidden="true"
                                                            className="size-[1.1rem]"
                                                        />
                                                    )}
                                                </span>

                                                <span className="text-xs font-bold tracking-[0.12em] text-muted-foreground">
                                                    0{index + 1}
                                                </span>
                                            </div>

                                            <h2 className="mt-4 text-sm font-bold text-foreground">
                                                {step.title}
                                            </h2>

                                            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </article>
                                    );
                                },
                            )}
                        </div>

                        <div
                            role="status"
                            aria-live="polite"
                            className={[
                                "mt-6 flex flex-col gap-4 rounded-2xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between",
                                isSynchronizing
                                    ? "border-info/20 bg-info-soft"
                                    : "border-success/20 bg-success-soft",
                            ].join(" ")}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={[
                                        "grid size-11 shrink-0 place-items-center rounded-xl",
                                        isSynchronizing
                                            ? "bg-info text-info-foreground"
                                            : "bg-success text-success-foreground",
                                    ].join(" ")}
                                >
                                    {isSynchronizing ? (
                                        <LoaderCircle
                                            aria-hidden="true"
                                            className="size-5 animate-spin"
                                        />
                                    ) : (
                                        <CheckCircle2
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    )}
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-foreground">
                                        {isSynchronizing
                                            ? "Synchronizing your rental"
                                            : "Synchronization finished"}
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                        {isSynchronizing
                                            ? "Please keep this page open while RESTNEST checks for the latest update."
                                            : "You can now open your tenant dashboard to review the latest rental status."}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={[
                                    "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold",
                                    isSynchronizing
                                        ? "bg-surface text-info"
                                        : "bg-surface text-success",
                                ].join(" ")}
                            >
                                {isSynchronizing ? (
                                    <>
                                        <Clock3
                                            aria-hidden="true"
                                            className="size-3.5"
                                        />
                                        Processing
                                    </>
                                ) : (
                                    <>
                                        <Check
                                            aria-hidden="true"
                                            className="size-3.5"
                                        />
                                        Updated
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/dashboard/tenant/rentals"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                            >
                                View my rentals

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/properties"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Browse properties

                                <Search
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                            Stripe webhook confirmation can take a few
                            moments. Your dashboard will reflect the final
                            payment and rental status after backend
                            processing is complete.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}