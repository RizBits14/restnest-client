"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleCheck,
    Clock3,
    CreditCard,
    LoaderCircle,
    MapPin,
    MessageSquareText,
    RefreshCw,
    Search,
    type LucideIcon,
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
    PENDING: "bg-warning-soft text-warning",
    APPROVED: "bg-info-soft text-info",
    REJECTED: "bg-danger-soft text-danger",
    ACTIVE: "bg-success-soft text-success",
    COMPLETED: "bg-brand-soft text-brand",
    CANCELLED: "bg-surface-muted text-muted-foreground",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    REFUNDED: "Refunded",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
    PENDING: "bg-warning-soft text-warning",
    COMPLETED: "bg-success-soft text-success",
    FAILED: "bg-danger-soft text-danger",
    REFUNDED: "bg-surface-muted text-muted-foreground",
};

type SummaryTone =
    | "brand"
    | "warning"
    | "info"
    | "success";

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
};

type RentalSummaryProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    tone: SummaryTone;
}>;

function RentalSummary({
    label,
    value,
    description,
    icon: Icon,
    tone,
}: RentalSummaryProps) {
    const toneStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft">
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

function RentalCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="relative aspect-[16/10] animate-pulse bg-surface-muted">
                <div className="absolute left-4 top-4 h-7 w-20 rounded-full bg-surface-elevated/80" />
                <div className="absolute right-4 top-4 h-7 w-24 rounded-full bg-surface-elevated/80" />
            </div>

            <div className="space-y-5 p-5 sm:p-6">
                <div className="flex justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-surface-muted" />
                        <div className="h-4 w-3/5 animate-pulse rounded-lg bg-surface-muted" />
                    </div>

                    <div className="h-10 w-20 animate-pulse rounded-xl bg-surface-muted" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 animate-pulse rounded-xl bg-surface-muted" />
                    <div className="h-20 animate-pulse rounded-xl bg-surface-muted" />
                </div>

                <div className="h-24 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-12 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        </div>
    );
}

function getPrimaryImage(images: string[]) {
    return (
        images.find((imageUrl) => imageUrl.trim().length > 0) ??
        null
    );
}

function getPaymentDescription(
    rental: TenantRentalRequest,
) {
    if (rental.payment) {
        if (rental.payment.status === "COMPLETED") {
            return `${rental.payment.provider} payment completed successfully.`;
        }

        if (rental.payment.status === "PENDING") {
            return `${rental.payment.provider} checkout was created and can be continued.`;
        }

        if (rental.payment.status === "FAILED") {
            return `${rental.payment.provider} payment was not completed.`;
        }

        return `${rental.payment.provider} payment was refunded.`;
    }

    if (rental.status === "APPROVED") {
        return "The landlord approved this request. Secure payment is now available.";
    }

    if (rental.status === "PENDING") {
        return "The request is waiting for the landlord’s decision.";
    }

    if (rental.status === "ACTIVE") {
        return "Payment is complete and the rental is currently active.";
    }

    if (rental.status === "COMPLETED") {
        return "The rental and review process has been completed.";
    }

    if (rental.status === "REJECTED") {
        return "This request was not approved, so payment is unavailable.";
    }

    return "No payment action is available for this request.";
}

type TenantRentalCardProps = Readonly<{
    rental: TenantRentalRequest;
}>;

function TenantRentalCard({
    rental,
}: TenantRentalCardProps) {
    const primaryImageUrl = getPrimaryImage(
        rental.property.images,
    );

    const isReadyForPayment =
        rental.status === "APPROVED" &&
        rental.payment?.status !== "COMPLETED";

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                <PropertyImage
                    key={primaryImageUrl ?? "property-placeholder"}
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${rental.property.title}`}
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
                    <span
                        className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm ${rentalStatusStyles[rental.status]}`}
                    >
                        {rentalStatusLabels[rental.status]}
                    </span>

                    <span className="max-w-[55%] truncate rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-sm">
                        {rental.property.category.name}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="line-clamp-2 text-lg font-bold leading-6 tracking-[-0.03em] text-foreground">
                            {rental.property.title}
                        </h2>

                        <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                            <MapPin
                                aria-hidden="true"
                                className="mt-1 size-4 shrink-0 text-accent"
                            />

                            <span className="line-clamp-2">
                                {rental.property.location}
                            </span>
                        </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-brand-soft px-3 py-2.5 text-right">
                        <p className="text-base font-bold text-brand">
                            {currencyFormatter.format(
                                rental.property.price,
                            )}
                        </p>

                        <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                            Total
                        </p>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-surface-subtle p-3.5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Move-in
                        </p>

                        <p className="mt-2 text-sm font-bold text-foreground">
                            {dateFormatter.format(
                                new Date(rental.moveInDate),
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl bg-surface-subtle p-3.5">
                        <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            <Clock3
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Duration
                        </p>

                        <p className="mt-2 text-sm font-bold text-foreground">
                            {rental.duration}{" "}
                            {rental.duration === 1 ? "month" : "months"}
                        </p>
                    </div>
                </div>

                {rental.message && (
                    <div className="mt-4 rounded-xl border border-border bg-surface-subtle p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <MessageSquareText
                                aria-hidden="true"
                                className="size-4 text-accent"
                            />
                            Your message
                        </p>

                        <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {rental.message}
                        </p>
                    </div>
                )}

                <div
                    className={[
                        "mt-4 rounded-xl border p-4",
                        isReadyForPayment
                            ? "border-info/20 bg-info-soft"
                            : "border-border bg-surface-subtle",
                    ].join(" ")}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <CreditCard
                                aria-hidden="true"
                                className="size-4 text-brand"
                            />
                            Payment
                        </p>

                        {rental.payment ? (
                            <span
                                className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${paymentStatusStyles[rental.payment.status]}`}
                            >
                                {paymentStatusLabels[rental.payment.status]}
                            </span>
                        ) : (
                            <span className="rounded-full bg-surface px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                                Not created
                            </span>
                        )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {getPaymentDescription(rental)}
                    </p>

                    {rental.payment?.paidAt && (
                        <p className="mt-2 text-xs font-semibold text-success">
                            Paid{" "}
                            {dateFormatter.format(
                                new Date(rental.payment.paidAt),
                            )}
                        </p>
                    )}
                </div>

                <div className="mt-auto pt-5">
                    {isReadyForPayment && (
                        <TenantPaymentButton
                            rentalRequestId={rental.id}
                            propertyTitle={rental.property.title}
                            payment={rental.payment}
                        />
                    )}

                    <TenantRentalReview rental={rental} />

                    <Link
                        href={`/properties/${rental.propertyId}`}
                        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                    >
                        View property

                        <ArrowUpRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>
                </div>
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
        <section aria-labelledby="tenant-rentals-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-info-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-info/20 bg-info-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-info">
                            Rental activity
                        </span>

                        <h1
                            id="tenant-rentals-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Track every request,
                            <span className="block text-brand">
                                payment, and review.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Follow landlord decisions, continue approved
                            Stripe payments, monitor active rentals, and
                            submit eligible reviews.
                        </p>
                    </div>

                    <Link
                        href="/properties"
                        className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                    >
                        <Search aria-hidden="true" className="size-4" />
                        Browse properties
                    </Link>
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
                    Updating rentals
                </div>
            )}

            {isLoading ? (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="h-44 animate-pulse rounded-[1.5rem] border border-border bg-surface-muted"
                            />
                        ))}
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }, (_, index) => (
                            <RentalCardSkeleton key={index} />
                        ))}
                    </div>
                </>
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
                        Rentals unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Rental requests could not be loaded
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
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <RentalSummary
                            label="Total requests"
                            value={rentals.length}
                            description="Every rental request submitted from this account."
                            icon={Building2}
                            tone="brand"
                        />

                        <RentalSummary
                            label="Pending"
                            value={pendingCount}
                            description="Requests currently waiting for a landlord decision."
                            icon={Clock3}
                            tone="warning"
                        />

                        <RentalSummary
                            label="Approved"
                            value={approvedCount}
                            description="Approved requests ready for payment or processing."
                            icon={CircleCheck}
                            tone="info"
                        />

                        <RentalSummary
                            label="Active"
                            value={activeCount}
                            description="Paid rental requests that are currently active."
                            icon={CheckCircle2}
                            tone="success"
                        />
                    </div>

                    {rentals.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
                            <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                <Building2
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                Start your rental journey
                            </p>

                            <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                No rental requests yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
                                Browse available properties and submit a rental
                                request to begin tracking your progress here.
                            </p>

                            <Link
                                href="/properties"
                                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                            >
                                Browse properties

                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-8 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
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