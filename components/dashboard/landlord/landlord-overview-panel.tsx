"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleOff,
    ClipboardList,
    Clock3,
    House,
    MapPin,
    Plus,
    RefreshCw,
    UserRound,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { getLandlordProperties } from "@/lib/api/landlord-properties-client";
import { getLandlordRequests } from "@/lib/api/landlord-requests-client";
import type {
    LandlordProperty,
    PropertyStatus,
} from "@/types/property";
import type {
    LandlordRentalRequest,
    RentalStatus,
} from "@/types/rental";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const propertyStatusLabels: Record<
    PropertyStatus,
    string
> = {
    AVAILABLE: "Available",
    RENTED: "Rented",
    UNAVAILABLE: "Unavailable",
};

const propertyStatusStyles: Record<
    PropertyStatus,
    string
> = {
    AVAILABLE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    RENTED:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    UNAVAILABLE:
        "border-zinc-600/25 bg-zinc-200 text-zinc-900 dark:border-zinc-400/30 dark:bg-zinc-800 dark:text-zinc-100",
};

const rentalStatusLabels: Record<
    RentalStatus,
    string
> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const rentalStatusStyles: Record<
    RentalStatus,
    string
> = {
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

type BreakdownItemProps = Readonly<{
    label: string;
    value: number;
    icon: LucideIcon;
}>;

function BreakdownItem({
    label,
    value,
    icon: Icon,
}: BreakdownItemProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon
                    aria-hidden="true"
                    className="size-4 text-brand"
                />
                {label}
            </p>

            <p className="text-sm font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}

type RecentPropertyItemProps = Readonly<{
    property: LandlordProperty;
}>;

function RecentPropertyItem({
    property,
}: RecentPropertyItemProps) {
    return (
        <article className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <Link
                        href={`/properties/${property.id}`}
                        className="line-clamp-1 text-sm font-semibold text-foreground transition-colors hover:text-brand"
                    >
                        {property.title}
                    </Link>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin
                            aria-hidden="true"
                            className="size-3.5 shrink-0 text-brand"
                        />

                        <span className="line-clamp-1">
                            {property.location}
                        </span>
                    </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-brand">
                    {currencyFormatter.format(property.price)}
                </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${propertyStatusStyles[property.status]}`}
                >
                    {propertyStatusLabels[property.status]}
                </span>

                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {property.category.name}
                </span>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays
                    aria-hidden="true"
                    className="size-3.5 text-brand"
                />
                Listed{" "}
                {dateFormatter.format(
                    new Date(property.createdAt),
                )}
            </p>
        </article>
    );
}

type RecentRequestItemProps = Readonly<{
    request: LandlordRentalRequest;
}>;

function RecentRequestItem({
    request,
}: RecentRequestItemProps) {
    return (
        <article className="py-4 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <UserRound
                            aria-hidden="true"
                            className="size-4 shrink-0 text-brand"
                        />

                        <span className="truncate">
                            {request.tenant.name}
                        </span>
                    </p>

                    <Link
                        href={`/properties/${request.propertyId}`}
                        className="mt-2 block line-clamp-1 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                        {request.property.title}
                    </Link>
                </div>

                <span
                    className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${rentalStatusStyles[request.status]}`}
                >
                    {rentalStatusLabels[request.status]}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <CalendarDays
                        aria-hidden="true"
                        className="size-3.5 text-brand"
                    />

                    Move-in{" "}
                    {dateFormatter.format(
                        new Date(request.moveInDate),
                    )}
                </span>

                <span className="inline-flex items-center gap-1.5">
                    <Clock3
                        aria-hidden="true"
                        className="size-3.5 text-brand"
                    />

                    {request.duration}{" "}
                    {request.duration === 1
                        ? "month"
                        : "months"}
                </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
                Updated{" "}
                {dateFormatter.format(
                    new Date(request.updatedAt),
                )}
            </p>
        </article>
    );
}

function LandlordOverviewSkeleton() {
    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from(
                    { length: 4 },
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
                            className="h-80 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
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
                            className="h-96 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                        />
                    ),
                )}
            </div>
        </>
    );
}

export function LandlordOverviewPanel() {
    const {
        data: properties = [],
        error: propertiesError,
        isLoading: isPropertiesLoading,
        isFetching: isPropertiesFetching,
        refetch: refetchProperties,
    } = useQuery<LandlordProperty[], Error>({
        queryKey: ["landlord", "properties"],
        queryFn: getLandlordProperties,
    });

    const {
        data: requests = [],
        error: requestsError,
        isLoading: isRequestsLoading,
        isFetching: isRequestsFetching,
        refetch: refetchRequests,
    } = useQuery<LandlordRentalRequest[], Error>({
        queryKey: ["landlord", "requests"],
        queryFn: getLandlordRequests,
    });

    const isLoading =
        isPropertiesLoading ||
        isRequestsLoading;

    const isFetching =
        isPropertiesFetching ||
        isRequestsFetching;

    const error =
        propertiesError ||
        requestsError;

    const availableCount = properties.filter(
        (property) => property.status === "AVAILABLE",
    ).length;

    const rentedCount = properties.filter(
        (property) => property.status === "RENTED",
    ).length;

    const unavailableCount = properties.filter(
        (property) => property.status === "UNAVAILABLE",
    ).length;

    const pendingCount = requests.filter(
        (request) => request.status === "PENDING",
    ).length;

    const approvedCount = requests.filter(
        (request) => request.status === "APPROVED",
    ).length;

    const rejectedCount = requests.filter(
        (request) => request.status === "REJECTED",
    ).length;

    const activeCount = requests.filter(
        (request) => request.status === "ACTIVE",
    ).length;

    const completedCount = requests.filter(
        (request) => request.status === "COMPLETED",
    ).length;

    const recentProperties = [...properties]
        .sort(
            (firstProperty, secondProperty) =>
                new Date(secondProperty.createdAt).getTime() -
                new Date(firstProperty.createdAt).getTime(),
        )
        .slice(0, 5);

    const recentRequests = [...requests]
        .sort(
            (firstRequest, secondRequest) =>
                new Date(secondRequest.updatedAt).getTime() -
                new Date(firstRequest.updatedAt).getTime(),
        )
        .slice(0, 5);

    const errorMessage =
        error instanceof Error
            ? error.message
            : "Your landlord dashboard could not be loaded.";

    function handleRetry() {
        void Promise.all([
            refetchProperties(),
            refetchRequests(),
        ]);
    }

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Landlord workspace
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Your rental business
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Monitor property availability, incoming
                        rental requests, landlord decisions, and
                        active rentals.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/dashboard/landlord/properties/new"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        <Plus
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                        Create property
                    </Link>

                    <Link
                        href="/dashboard/landlord/requests"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        Review requests
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
                    <LandlordOverviewSkeleton />
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
                        onClick={handleRetry}
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
                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            description="All property listings owned by you."
                            icon={Building2}
                        />

                        <SummaryCard
                            label="Available properties"
                            value={availableCount}
                            description="Listings currently accepting requests."
                            icon={House}
                        />

                        <SummaryCard
                            label="Total requests"
                            value={requests.length}
                            description="All requests received for your properties."
                            icon={ClipboardList}
                        />

                        <SummaryCard
                            label="Awaiting decision"
                            value={pendingCount}
                            description="Pending requests requiring your review."
                            icon={Clock3}
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Property availability
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Current status of your listings.
                                    </p>
                                </div>

                                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                                    <Building2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3">
                                <BreakdownItem
                                    label="Available"
                                    value={availableCount}
                                    icon={CheckCircle2}
                                />

                                <BreakdownItem
                                    label="Rented"
                                    value={rentedCount}
                                    icon={House}
                                />

                                <BreakdownItem
                                    label="Unavailable"
                                    value={unavailableCount}
                                    icon={CircleOff}
                                />
                            </div>

                            <Link
                                href="/dashboard/landlord/properties"
                                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                            >
                                Manage properties
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-brand"
                                />
                            </Link>
                        </article>

                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Rental request activity
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Requests grouped by current status.
                                    </p>
                                </div>

                                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <BreakdownItem
                                    label="Pending"
                                    value={pendingCount}
                                    icon={Clock3}
                                />

                                <BreakdownItem
                                    label="Approved"
                                    value={approvedCount}
                                    icon={CheckCircle2}
                                />

                                <BreakdownItem
                                    label="Rejected"
                                    value={rejectedCount}
                                    icon={XCircle}
                                />

                                <BreakdownItem
                                    label="Active"
                                    value={activeCount}
                                    icon={House}
                                />

                                <BreakdownItem
                                    label="Completed"
                                    value={completedCount}
                                    icon={CheckCircle2}
                                />
                            </div>

                            <Link
                                href="/dashboard/landlord/requests"
                                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                            >
                                Manage requests
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-brand"
                                />
                            </Link>
                        </article>
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Recently listed properties
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your newest marketplace listings.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/landlord/properties"
                                    className="text-sm font-semibold text-brand hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentProperties.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Building2
                                        aria-hidden="true"
                                        className="mx-auto size-7 text-brand"
                                    />

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        You have not listed any properties.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentProperties.map((property) => (
                                        <RecentPropertyItem
                                            key={property.id}
                                            property={property}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Recent rental requests
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your most recently updated requests.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/landlord/requests"
                                    className="text-sm font-semibold text-brand hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentRequests.length === 0 ? (
                                <div className="py-10 text-center">
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="mx-auto size-7 text-brand"
                                    />

                                    <p className="mt-3 text-sm text-muted-foreground">
                                        No rental requests have been received.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentRequests.map((request) => (
                                        <RecentRequestItem
                                            key={request.id}
                                            request={request}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>
                    </div>
                </>
            )}
        </section>
    );
}