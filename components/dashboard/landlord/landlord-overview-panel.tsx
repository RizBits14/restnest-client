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
    LoaderCircle,
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
    AVAILABLE: "bg-success-soft text-success",
    RENTED: "bg-info-soft text-info",
    UNAVAILABLE:
        "bg-surface-muted text-muted-foreground",
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
    PENDING: "bg-warning-soft text-warning",
    APPROVED: "bg-info-soft text-info",
    REJECTED: "bg-danger-soft text-danger",
    ACTIVE: "bg-success-soft text-success",
    COMPLETED: "bg-brand-soft text-brand",
    CANCELLED:
        "bg-surface-muted text-muted-foreground",
};

type SummaryTone =
    | "brand"
    | "success"
    | "accent"
    | "warning";

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
    success: {
        icon: "bg-success-soft text-success",
        value: "text-success",
    },
    accent: {
        icon: "bg-accent-soft text-accent",
        value: "text-accent",
    },
    warning: {
        icon: "bg-warning-soft text-warning",
        value: "text-warning",
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
    const visualStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${visualStyle.icon}`}
                >
                    <Icon aria-hidden="true" className="size-5" />
                </span>

                <p
                    className={`text-3xl font-bold tracking-[-0.05em] ${visualStyle.value}`}
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

type BreakdownTone =
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "neutral";

const breakdownToneStyles: Record<
    BreakdownTone,
    string
> = {
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    neutral:
        "bg-surface-muted text-muted-foreground",
};

type BreakdownItemProps = Readonly<{
    label: string;
    value: number;
    icon: LucideIcon;
    tone: BreakdownTone;
}>;

function BreakdownItem({
    label,
    value,
    icon: Icon,
    tone,
}: BreakdownItemProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${breakdownToneStyles[tone]}`}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-4"
                    />
                </span>

                <p className="truncate text-sm font-semibold text-muted-foreground">
                    {label}
                </p>
            </div>

            <p className="shrink-0 text-lg font-bold text-foreground">
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
        <article className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/properties/${property.id}`}
                        className="line-clamp-1 text-sm font-bold text-foreground transition-colors duration-200 hover:text-brand"
                    >
                        {property.title}
                    </Link>

                    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                        <MapPin
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0 text-accent"
                        />

                        <span className="line-clamp-1">
                            {property.location}
                        </span>
                    </p>
                </div>

                <div className="shrink-0 rounded-xl bg-brand-soft px-3 py-2 text-right">
                    <p className="text-sm font-bold text-brand">
                        {currencyFormatter.format(property.price)}
                    </p>

                    <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                        Total
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${propertyStatusStyles[property.status]}`}
                >
                    {propertyStatusLabels[property.status]}
                </span>

                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[0.68rem] font-bold text-muted-foreground">
                    {property.category.name}
                </span>
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
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
        <article className="py-5 first:pt-0 last:pb-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <UserRound
                            aria-hidden="true"
                            className="size-4 shrink-0 text-accent"
                        />

                        <span className="truncate">
                            {request.tenant.name}
                        </span>
                    </p>

                    <Link
                        href={`/properties/${request.propertyId}`}
                        className="mt-2 block line-clamp-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-brand"
                    >
                        {request.property.title}
                    </Link>
                </div>

                <span
                    className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${rentalStatusStyles[request.status]}`}
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

            <p className="mt-3 text-xs text-muted-foreground">
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
                {Array.from({ length: 4 }, (_, index) => (
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
                        className="h-80 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                    />
                ))}
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {Array.from({ length: 2 }, (_, index) => (
                    <div
                        key={index}
                        className="h-96 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                    />
                ))}
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
        isPropertiesLoading || isRequestsLoading;

    const isFetching =
        isPropertiesFetching || isRequestsFetching;

    const error =
        propertiesError || requestsError;

    const availableCount = properties.filter(
        (property) => property.status === "AVAILABLE",
    ).length;

    const rentedCount = properties.filter(
        (property) => property.status === "RENTED",
    ).length;

    const unavailableCount = properties.filter(
        (property) =>
            property.status === "UNAVAILABLE",
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
        <section aria-labelledby="landlord-overview-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-accent-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            Landlord workspace
                        </span>

                        <h1
                            id="landlord-overview-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Manage your rental business,
                            <span className="block text-brand">
                                all in one place.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Monitor property availability, incoming rental
                            requests, landlord decisions, and active rental
                            activity.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/dashboard/landlord/properties/new"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                        >
                            <Plus
                                aria-hidden="true"
                                className="size-4"
                            />

                            Create property
                        </Link>

                        <Link
                            href="/dashboard/landlord/requests"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            Review requests

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
                    <LandlordOverviewSkeleton />
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
                        onClick={handleRetry}
                        disabled={isFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isFetching
                            ? "Trying again"
                            : "Try again"}
                    </button>
                </div>
            ) : (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            description="Every property listing owned by your account."
                            icon={Building2}
                            tone="brand"
                        />

                        <SummaryCard
                            label="Available properties"
                            value={availableCount}
                            description="Listings currently available for new requests."
                            icon={House}
                            tone="success"
                        />

                        <SummaryCard
                            label="Total requests"
                            value={requests.length}
                            description="Every request received across your properties."
                            icon={ClipboardList}
                            tone="accent"
                        />

                        <SummaryCard
                            label="Awaiting decision"
                            value={pendingCount}
                            description="Pending requests that require your response."
                            icon={Clock3}
                            tone="warning"
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Listing health
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Property availability
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Current status of your property listings.
                                    </p>
                                </div>

                                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                                    <Building2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <BreakdownItem
                                    label="Available"
                                    value={availableCount}
                                    icon={CheckCircle2}
                                    tone="success"
                                />

                                <BreakdownItem
                                    label="Rented"
                                    value={rentedCount}
                                    icon={House}
                                    tone="info"
                                />

                                <BreakdownItem
                                    label="Unavailable"
                                    value={unavailableCount}
                                    icon={CircleOff}
                                    tone="neutral"
                                />
                            </div>

                            <Link
                                href="/dashboard/landlord/properties"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Manage properties

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </article>

                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                        Tenant activity
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Rental request activity
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Requests grouped by their current status.
                                    </p>
                                </div>

                                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                                    <ClipboardList
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <BreakdownItem
                                    label="Pending"
                                    value={pendingCount}
                                    icon={Clock3}
                                    tone="warning"
                                />

                                <BreakdownItem
                                    label="Approved"
                                    value={approvedCount}
                                    icon={CheckCircle2}
                                    tone="info"
                                />

                                <BreakdownItem
                                    label="Rejected"
                                    value={rejectedCount}
                                    icon={XCircle}
                                    tone="danger"
                                />

                                <BreakdownItem
                                    label="Active"
                                    value={activeCount}
                                    icon={House}
                                    tone="success"
                                />

                                <BreakdownItem
                                    label="Completed"
                                    value={completedCount}
                                    icon={CheckCircle2}
                                    tone="neutral"
                                />
                            </div>

                            <Link
                                href="/dashboard/landlord/requests"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Manage requests

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </article>
                    </div>

                    <div className="mt-6 grid items-start gap-5 xl:grid-cols-2">
                        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
                            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-subtle p-5 sm:p-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Latest listings
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Recently listed properties
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Your newest marketplace listings.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/landlord/properties"
                                    className="shrink-0 text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentProperties.length === 0 ? (
                                <div className="px-5 py-12 text-center sm:px-6">
                                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                                        <Building2
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-foreground">
                                        No properties listed
                                    </h3>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Create your first property to see it here.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border px-5 py-5 sm:px-6">
                                    {recentProperties.map((property) => (
                                        <RecentPropertyItem
                                            key={property.id}
                                            property={property}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
                            <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-subtle p-5 sm:p-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                        Latest activity
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Recent rental requests
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Your most recently updated requests.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/landlord/requests"
                                    className="shrink-0 text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentRequests.length === 0 ? (
                                <div className="px-5 py-12 text-center sm:px-6">
                                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                                        <ClipboardList
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-foreground">
                                        No rental requests
                                    </h3>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        New tenant requests will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border px-5 py-5 sm:px-6">
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