"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    CircleCheck,
    Clock3,
    CreditCard,
    MapPin,
    MessageSquareText,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { TenantPaymentButton } from "@/components/dashboard/tenant/tenant-payment-button";
import { TenantRentalReview } from "@/components/dashboard/tenant/tenant-rental-review";

import { PropertyImage } from "@/components/properties/property-image";
import {
    getTenantRentals,
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";
import type {
    PaymentStatus,
    RentalStatus,
    TenantRentalRequest,
} from "@/types/rental";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
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
        "border-amber-700/30 bg-amber-100 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950 dark:text-amber-200",
    APPROVED:
        "border-blue-700/30 bg-blue-100 text-blue-900 dark:border-blue-400/40 dark:bg-blue-950 dark:text-blue-200",
    REJECTED:
        "border-red-700/30 bg-red-100 text-red-900 dark:border-red-400/40 dark:bg-red-950 dark:text-red-200",
    ACTIVE:
        "border-emerald-700/30 bg-emerald-100 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950 dark:text-emerald-200",
    COMPLETED:
        "border-violet-700/30 bg-violet-100 text-violet-900 dark:border-violet-400/40 dark:bg-violet-950 dark:text-violet-200",
    CANCELLED:
        "border-zinc-600/30 bg-zinc-200 text-zinc-900 dark:border-zinc-400/40 dark:bg-zinc-800 dark:text-zinc-100",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    REFUNDED: "Refunded",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
    PENDING:
        "border-amber-700/30 bg-amber-100 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950 dark:text-amber-200",
    COMPLETED:
        "border-emerald-700/30 bg-emerald-100 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-950 dark:text-emerald-200",
    FAILED:
        "border-red-700/30 bg-red-100 text-red-900 dark:border-red-400/40 dark:bg-red-950 dark:text-red-200",
    REFUNDED:
        "border-zinc-600/30 bg-zinc-200 text-zinc-900 dark:border-zinc-400/40 dark:bg-zinc-800 dark:text-zinc-100",
};

type RentalSummaryProps = Readonly<{
    label: string;
    value: number;
    icon: typeof Building2;
}>;

function RentalSummary({
    label,
    value,
    icon: Icon,
}: RentalSummaryProps) {
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

            <p className="mt-4 text-sm font-medium text-muted-foreground">
                {label}
            </p>
        </article>
    );
}

function RentalCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="aspect-[16/9] animate-pulse bg-surface-muted" />

            <div className="space-y-4 p-5">
                <div className="h-6 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-surface-muted" />
                <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        </div>
    );
}

type TenantRentalCardProps = Readonly<{
    rental: TenantRentalRequest;
}>;

function TenantRentalCard({
    rental,
}: TenantRentalCardProps) {
    const primaryImageUrl =
        rental.property.images.find(
            (imageUrl) => imageUrl.trim(),
        ) ?? null;

    return (
        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface">
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={
                        primaryImageUrl ??
                        "property-placeholder"
                    }
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${rental.property.title}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                />

                <span
                    className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${rentalStatusStyles[rental.status]}`}
                >
                    {rentalStatusLabels[rental.status]}
                </span>

                <span className="absolute right-4 top-4 rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {rental.property.category.name}
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="line-clamp-1 text-lg font-semibold tracking-[-0.025em] text-foreground">
                            {rental.property.title}
                        </h2>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin
                                aria-hidden="true"
                                className="size-4 shrink-0 text-brand"
                            />

                            <span className="line-clamp-1">
                                {rental.property.location}
                            </span>
                        </p>
                    </div>

                    <div className="shrink-0 text-right">
                        <p className="text-lg font-semibold text-brand">
                            {currencyFormatter.format(
                                rental.property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Total payment
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Move-in date
                        </p>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {dateFormatter.format(
                                new Date(rental.moveInDate),
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            <Clock3
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Duration
                        </p>

                        <p className="mt-2 text-sm font-semibold text-foreground">
                            {rental.duration}{" "}
                            {rental.duration === 1
                                ? "month"
                                : "months"}
                        </p>
                    </div>
                </div>

                {rental.message && (
                    <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <MessageSquareText
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Your message
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {rental.message}
                        </p>
                    </div>
                )}

                <div className="mt-4 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CreditCard
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Payment
                        </p>

                        {rental.payment && (
                            <span
                                className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentStatusStyles[rental.payment.status]}`}
                            >
                                {paymentStatusLabels[
                                    rental.payment.status
                                ]}
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {rental.payment
                            ? `${rental.payment.provider} payment record created.`
                            : rental.status === "APPROVED"
                                ? "Your request is approved and ready for payment."
                                : rental.status === "PENDING"
                                    ? "Waiting for the landlord’s decision."
                                    : rental.status === "ACTIVE"
                                        ? "Payment completed and rental activated."
                                        : rental.status === "COMPLETED"
                                            ? "Rental and review process completed."
                                            : "No payment is available for this request."}
                    </p>
                </div>

                {rental.status === "APPROVED" &&
                    rental.payment?.status !== "COMPLETED" && (
                        <div className="mt-5">
                            <TenantPaymentButton
                                rentalRequestId={rental.id}
                                propertyTitle={
                                    rental.property.title
                                }
                                payment={rental.payment}
                            />
                        </div>
                    )}

                <TenantRentalReview rental={rental} />

                <Link
                    href={`/properties/${rental.propertyId}`}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                >
                    View property
                    <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-brand"
                    />
                </Link>
            </div>
        </article>
    );
}

export function TenantRentalsPanel() {
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

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Your rental requests could not be loaded.";

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Rental activity
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Your rental requests
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Track landlord decisions, payment
                        readiness, active rentals, and completed
                        rental history.
                    </p>
                </div>

                {isFetching && !isLoading && (
                    <p
                        role="status"
                        className="text-sm font-medium text-brand"
                    >
                        Updating rentals...
                    </p>
                )}
            </div>

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from(
                            { length: 4 },
                            (_, index) => (
                                <div
                                    key={index}
                                    className="h-32 animate-pulse rounded-2xl border border-border bg-surface-muted"
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from(
                            { length: 6 },
                            (_, index) => (
                                <RentalCardSkeleton
                                    key={index}
                                />
                            ),
                        )}
                    </div>
                </>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-7 text-brand"
                    />

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Rentals could not be loaded
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
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <RentalSummary
                            label="Total requests"
                            value={rentals.length}
                            icon={Building2}
                        />

                        <RentalSummary
                            label="Pending"
                            value={pendingCount}
                            icon={Clock3}
                        />

                        <RentalSummary
                            label="Approved"
                            value={approvedCount}
                            icon={CircleCheck}
                        />

                        <RentalSummary
                            label="Active"
                            value={activeCount}
                            icon={CreditCard}
                        />
                    </div>

                    {rentals.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-surface-muted text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <h2 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-foreground">
                                No rental requests yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg leading-7 text-muted-foreground">
                                Browse available properties and
                                submit a rental request to begin.
                            </p>

                            <Link
                                href="/properties"
                                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                            >
                                Browse properties
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {rentals.map((rental) => (
                                <TenantRentalCard
                                    key={rental.id}
                                    rental={rental}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}