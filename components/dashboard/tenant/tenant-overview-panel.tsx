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
    LoaderCircle,
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
    PENDING: "bg-warning-soft text-warning",
    APPROVED: "bg-info-soft text-info",
    REJECTED: "bg-danger-soft text-danger",
    ACTIVE: "bg-success-soft text-success",
    COMPLETED: "bg-brand-soft text-brand",
    CANCELLED: "bg-surface-muted text-muted-foreground",
};

type SummaryTone =
    | "brand"
    | "warning"
    | "info"
    | "success"
    | "accent";

const summaryToneStyles: Record<
    SummaryTone,
    Readonly<{
        icon: string;
        value: string;
    }>
> = {
    brand: {
        icon: "bg-brand-soft text-brand",
        value: "text-brand",
    },
    warning: {
        icon: "bg-warning-soft text-warning",
        value: "text-warning",
    },
    info: {
        icon: "bg-info-soft text-info",
        value: "text-info",
    },
    success: {
        icon: "bg-success-soft text-success",
        value: "text-success",
    },
    accent: {
        icon: "bg-accent-soft text-accent",
        value: "text-accent",
    },
};

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone: SummaryTone;
}>;

function SummaryCard({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: SummaryCardProps) {
    const toneStyle = summaryToneStyles[tone];

    return (
        <article className="group rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${toneStyle.icon}`}
                >
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p
                    className={`text-3xl font-bold tracking-[-0.05em] ${toneStyle.value}`}
                >
                    {value}
                </p>
            </div>

            <h2 className="mt-5 text-sm font-bold text-foreground">
                {label}
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
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
    tone: "payment" | "review";
}>;

function ActionCard({
    title,
    description,
    count,
    actionLabel,
    href,
    icon: Icon,
    tone,
}: ActionCardProps) {
    const visualStyle =
        tone === "payment"
            ? {
                card: "border-info/20 bg-info-soft",
                icon: "bg-info text-info-foreground",
                count: "text-info",
            }
            : {
                card: "border-warning/20 bg-warning-soft",
                icon: "bg-warning text-warning-foreground",
                count: "text-warning",
            };

    return (
        <article
            className={`rounded-[1.75rem] border p-5 shadow-soft sm:p-6 ${visualStyle.card}`}
        >
            <div className="flex items-start justify-between gap-5">
                <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl ${visualStyle.icon}`}
                >
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p
                    className={`text-4xl font-bold tracking-[-0.055em] ${visualStyle.count}`}
                >
                    {count}
                </p>
            </div>

            <h2 className="mt-5 text-lg font-bold tracking-[-0.025em] text-foreground">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>

            <Link
                href={href}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-surface px-4 text-sm font-bold text-foreground shadow-soft transition-colors duration-200 hover:bg-surface-elevated hover:text-brand"
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
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={`/properties/${rental.propertyId}`}
                            className="line-clamp-1 text-sm font-bold text-foreground transition-colors duration-200 hover:text-brand"
                        >
                            {rental.property.title}
                        </Link>

                        <span
                            className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${rentalStatusStyles[rental.status]}`}
                        >
                            {rentalStatusLabels[rental.status]}
                        </span>
                    </div>

                    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                        <MapPin
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-accent"
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
                            {rental.duration === 1 ? "month" : "months"}
                        </span>
                    </div>
                </div>

                <div className="shrink-0 rounded-xl bg-surface-subtle px-4 py-3 sm:text-right">
                    <p className="text-base font-bold text-brand">
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
                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        key={index}
                        className="h-44 animate-pulse rounded-[1.5rem] border border-border bg-surface-muted"
                    />
                ))}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {Array.from({ length: 2 }, (_, index) => (
                    <div
                        key={index}
                        className="h-72 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                    />
                ))}
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
        <section aria-labelledby="tenant-overview-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-info-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-info/20 bg-info-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-info">
                            Tenant workspace
                        </span>

                        <h1
                            id="tenant-overview-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Your rental overview,
                            <span className="block text-brand">
                                clearly organized.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Track requests, approved payments, active
                            properties, and completed rental experiences from
                            one focused workspace.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/properties"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                        >
                            <House aria-hidden="true" className="size-4" />
                            Browse properties
                        </Link>

                        <Link
                            href="/dashboard/tenant/rentals"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            My rentals

                            <ArrowRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </Link>
                    </div>
                </div>
            </header>

            {isFetching && !isLoading && (
                <div
                    role="status"
                    className="mt-5 flex w-fit items-center gap-2 rounded-full bg-info-soft px-3.5 py-2 text-xs font-bold text-info"
                >
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-3.5 animate-spin"
                    />
                    Updating dashboard
                </div>
            )}

            {isLoading ? (
                <div className="mt-8">
                    <TenantOverviewSkeleton />
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="mt-8 rounded-[2rem] border border-danger/20 bg-surface p-8 text-center shadow-soft sm:p-12"
                >
                    <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-danger-soft text-danger">
                        <RefreshCw
                            aria-hidden="true"
                            className={`size-7 ${isFetching ? "animate-spin" : ""
                                }`}
                        />
                    </span>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                        Dashboard unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Dashboard could not be loaded
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isFetching ? "Trying again" : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <SummaryCard
                            label="Total requests"
                            value={rentals.length}
                            description="Every rental request submitted from your account."
                            icon={ClipboardList}
                            tone="brand"
                        />

                        <SummaryCard
                            label="Pending"
                            value={pendingCount}
                            description="Requests waiting for a landlord decision."
                            icon={Clock3}
                            tone="warning"
                        />

                        <SummaryCard
                            label="Approved"
                            value={approvedCount}
                            description="Requests approved and ready for the next step."
                            icon={CheckCircle2}
                            tone="info"
                        />

                        <SummaryCard
                            label="Active"
                            value={activeCount}
                            description="Paid rentals that are currently in progress."
                            icon={Building2}
                            tone="success"
                        />

                        <SummaryCard
                            label="Completed"
                            value={completedCount}
                            description="Rental experiences completed after review."
                            icon={Star}
                            tone="accent"
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <ActionCard
                            title="Ready for payment"
                            description="Approved rental requests currently waiting for secure Stripe payment."
                            count={readyForPaymentCount}
                            actionLabel={
                                readyForPaymentCount > 0
                                    ? "Complete payment"
                                    : "View rental requests"
                            }
                            href="/dashboard/tenant/rentals"
                            icon={CreditCard}
                            tone="payment"
                        />

                        <ActionCard
                            title="Waiting for your review"
                            description="Active rentals with completed payments that are eligible for feedback."
                            count={awaitingReviewCount}
                            actionLabel={
                                awaitingReviewCount > 0
                                    ? "Leave a review"
                                    : "View rental history"
                            }
                            href="/dashboard/tenant/rentals"
                            icon={Star}
                            tone="review"
                        />
                    </div>

                    <article className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
                        <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                    Latest updates
                                </p>

                                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                    Recent rental activity
                                </h2>

                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Your most recently updated rental requests.
                                </p>
                            </div>

                            <Link
                                href="/dashboard/tenant/rentals"
                                className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                View all rentals

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        {recentRentals.length === 0 ? (
                            <div className="px-5 py-12 text-center sm:px-6">
                                <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="size-7"
                                    />
                                </span>

                                <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                    Your journey starts here
                                </p>

                                <h3 className="mt-2 text-xl font-bold tracking-[-0.025em] text-foreground">
                                    No rental activity yet
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                                    Browse available properties and submit your
                                    first rental request.
                                </p>

                                <Link
                                    href="/properties"
                                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                                >
                                    Browse properties

                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border px-5 py-5 sm:px-6">
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