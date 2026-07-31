"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    ClipboardList,
    Clock3,
    CreditCard,
    House,
    MapPin,
    RefreshCw,
    Star,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
    getTenantRentals,
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";
import type {
    RentalStatus,
    TenantRentalRequest,
} from "@/types/rental";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const rentalStatusLabels: Record<RentalStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const rentalStatusStyles: Record<RentalStatus, string> = {
    PENDING:
        "border-amber-700/25 bg-amber-100 text-amber-900 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-200",
    APPROVED:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    REJECTED:
        "border-red-700/25 bg-red-100 text-red-900 dark:border-red-400/30 dark:bg-red-950 dark:text-red-200",
    ACTIVE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    COMPLETED:
        "border-violet-700/25 bg-violet-100 text-violet-900 dark:border-violet-400/30 dark:bg-violet-950 dark:text-violet-200",
    CANCELLED:
        "border-zinc-600/25 bg-zinc-200 text-zinc-900 dark:border-zinc-400/30 dark:bg-zinc-800 dark:text-zinc-100",
};

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
}>;

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
}: SummaryCardProps) {
    return (
        <article className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>

                <p className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    {value}
                </p>
            </div>

            <p className="mt-4 text-sm font-semibold text-foreground">
                {label}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {description}
            </p>
        </article>
    );
}

type ActionCardProps = Readonly<{
    title: string;
    description: string;
    count: number;
    actionLabel: string;
    href: string;
    icon: LucideIcon;
}>;

function ActionCard({
    title,
    description,
    count,
    actionLabel,
    href,
    icon: Icon,
}: ActionCardProps) {
    return (
        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-surface-muted text-brand">
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>

                <p className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    {count}
                </p>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-foreground">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>

            <Link
                href={href}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
            >
                {actionLabel}

                <ArrowRight
                    aria-hidden="true"
                    className="size-4 text-brand"
                />
            </Link>
        </article>
    );
}

type RecentRentalItemProps = Readonly<{
    rental: TenantRentalRequest;
}>;

function RecentRentalItem({
    rental,
}: RecentRentalItemProps) {
    return (
        <article className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={`/properties/${rental.propertyId}`}
                            className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-brand"
                        >
                            {rental.property.title}
                        </Link>

                        <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${rentalStatusStyles[rental.status]}`}
                        >
                            {rentalStatusLabels[rental.status]}
                        </span>
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin
                            aria-hidden="true"
                            className="size-4 shrink-0 text-brand"
                        />

                        <span className="line-clamp-1">
                            {rental.property.location}
                        </span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-3.5 text-brand"
                            />

                            Move-in{" "}
                            {dateFormatter.format(
                                new Date(rental.moveInDate),
                            )}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                            <Clock3
                                aria-hidden="true"
                                className="size-3.5 text-brand"
                            />

                            {rental.duration}{" "}
                            {rental.duration === 1
                                ? "month"
                                : "months"}
                        </span>
                    </div>
                </div>

                <div className="shrink-0 sm:text-right">
                    <p className="text-base font-semibold text-brand">
                        {currencyFormatter.format(
                            rental.property.price,
                        )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Updated{" "}
                        {dateFormatter.format(
                            new Date(rental.updatedAt),
                        )}
                    </p>
                </div>
            </div>
        </article>
    );
}

function TenantOverviewSkeleton() {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {Array.from(
                    { length: 5 },
                    (_, index) => (
                        <div
                            key={index}
                            className="h-40 animate-pulse rounded-2xl border border-border bg-surface-muted"
                        />
                    ),
                )}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {Array.from(
                    { length: 2 },
                    (_, index) => (
                        <div
                            key={index}
                            className="h-64 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                        />
                    ),
                )}
            </div>

            <div className="mt-6 h-96 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted" />
        </>
    );
}

export function TenantOverviewPanel() {
    const {
        data: rentals = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: tenantRentalsQueryKey,
        queryFn: getTenantRentals,
    });

    const pendingCount = rentals.filter(
        (rental) => rental.status === "PENDING",
    ).length;

    const approvedCount = rentals.filter(
        (rental) => rental.status === "APPROVED",
    ).length;

    const activeCount = rentals.filter(
        (rental) => rental.status === "ACTIVE",
    ).length;

    const completedCount = rentals.filter(
        (rental) => rental.status === "COMPLETED",
    ).length;

    const readyForPaymentCount = rentals.filter(
        (rental) =>
            rental.status === "APPROVED" &&
            rental.payment?.status !== "COMPLETED",
    ).length;

    const awaitingReviewCount = rentals.filter(
        (rental) =>
            rental.status === "ACTIVE" &&
            rental.payment?.status === "COMPLETED" &&
            !rental.review,
    ).length;

    const recentRentals = [...rentals]
        .sort(
            (firstRental, secondRental) =>
                new Date(secondRental.updatedAt).getTime() -
                new Date(firstRental.updatedAt).getTime(),
        )
        .slice(0, 5);

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Your tenant dashboard could not be loaded.";

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Tenant workspace
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Your rental overview
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Track rental requests, approved payments,
                        active properties, and completed rental
                        experiences.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/properties"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        <House
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                        Browse properties
                    </Link>

                    <Link
                        href="/dashboard/tenant/rentals"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        My rentals
                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>
                </div>
            </div>

            {isFetching && !isLoading && (
                <p
                    role="status"
                    className="mt-5 text-sm font-medium text-brand"
                >
                    Updating your dashboard...
                </p>
            )}

            {isLoading ? (
                <div className="mt-8">
                    <TenantOverviewSkeleton />
                </div>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-8 text-brand"
                    />

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Dashboard could not be loaded
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching
                            ? "Trying again..."
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <SummaryCard
                            label="Total requests"
                            value={rentals.length}
                            description="All rental requests you have submitted."
                            icon={ClipboardList}
                        />

                        <SummaryCard
                            label="Pending"
                            value={pendingCount}
                            description="Requests awaiting a landlord decision."
                            icon={Clock3}
                        />

                        <SummaryCard
                            label="Approved"
                            value={approvedCount}
                            description="Requests approved by landlords."
                            icon={CheckCircle2}
                        />

                        <SummaryCard
                            label="Active"
                            value={activeCount}
                            description="Paid rentals currently in progress."
                            icon={Building2}
                        />

                        <SummaryCard
                            label="Completed"
                            value={completedCount}
                            description="Rentals completed after your review."
                            icon={Star}
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <ActionCard
                            title="Ready for payment"
                            description="Approved rental requests that are waiting for Stripe payment."
                            count={readyForPaymentCount}
                            actionLabel={
                                readyForPaymentCount > 0
                                    ? "Complete payment"
                                    : "View rental requests"
                            }
                            href="/dashboard/tenant/rentals"
                            icon={CreditCard}
                        />

                        <ActionCard
                            title="Waiting for your review"
                            description="Active rentals with completed payments that are ready for feedback."
                            count={awaitingReviewCount}
                            actionLabel={
                                awaitingReviewCount > 0
                                    ? "Leave a review"
                                    : "View rental history"
                            }
                            href="/dashboard/tenant/rentals"
                            icon={Star}
                        />
                    </div>

                    <article className="mt-6 rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                        <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Recent rental activity
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your most recently updated rental
                                    requests.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/tenant/rentals"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                            >
                                View all rentals
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        {recentRentals.length === 0 ? (
                            <div className="py-12 text-center">
                                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-muted text-brand">
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </span>

                                <h3 className="mt-4 text-lg font-semibold text-foreground">
                                    No rental activity yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                    Browse available properties and
                                    submit your first rental request.
                                </p>

                                <Link
                                    href="/properties"
                                    className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                                >
                                    Browse properties
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentRentals.map((rental) => (
                                    <RecentRentalItem
                                        key={rental.id}
                                        rental={rental}
                                    />
                                ))}
                            </div>
                        )}
                    </article>
                </>
            )}
        </section>
    );
}