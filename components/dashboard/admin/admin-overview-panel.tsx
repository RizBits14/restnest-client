"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Ban,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleOff,
    House,
    LoaderCircle,
    Mail,
    MapPin,
    RefreshCw,
    ShieldCheck,
    UserRound,
    UsersRound,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
    adminPropertiesQueryKey,
    getAdminProperties,
} from "@/lib/api/admin-properties-client";
import {
    adminUsersQueryKey,
    getAdminUsers,
} from "@/lib/api/admin-users-client";
import type {
    AdminProperty,
    AdminUser,
} from "@/types/admin";
import type {
    UserRole,
    UserStatus,
} from "@/types/auth";
import type { PropertyStatus } from "@/types/property";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const roleLabels: Record<UserRole, string> = {
    TENANT: "Tenant",
    LANDLORD: "Landlord",
    ADMIN: "Administrator",
};

const roleStyles: Record<UserRole, string> = {
    TENANT: "bg-info-soft text-info",
    LANDLORD: "bg-accent-soft text-accent",
    ADMIN: "bg-warning-soft text-warning",
};

const userStatusLabels: Record<UserStatus, string> = {
    ACTIVE: "Active",
    BANNED: "Banned",
};

const userStatusStyles: Record<UserStatus, string> = {
    ACTIVE: "bg-success-soft text-success",
    BANNED: "bg-danger-soft text-danger",
};

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

type SummaryTone =
    | "brand"
    | "success"
    | "warning"
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
    success: {
        icon: "bg-success-soft text-success",
        value: "text-success",
    },
    warning: {
        icon: "bg-warning-soft text-warning",
        value: "text-warning",
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
    const visualStyle = summaryToneStyles[tone];

    return (
        <article className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-raised">
            <div className="flex items-start justify-between gap-4">
                <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl ${visualStyle.icon}`}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
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
    | "brand"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "accent"
    | "neutral";

const breakdownToneStyles: Record<
    BreakdownTone,
    string
> = {
    brand: "bg-brand-soft text-brand",
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    accent: "bg-accent-soft text-accent",
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

function AdminOverviewSkeleton() {
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

type RecentUserItemProps = Readonly<{
    user: AdminUser;
}>;

function RecentUserItem({
    user,
}: RecentUserItemProps) {
    return (
        <article className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <UserRound
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">
                                {user.name}
                            </p>

                            <p className="mt-1.5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                                <Mail
                                    aria-hidden="true"
                                    className="mt-0.5 size-3.5 shrink-0 text-brand"
                                />

                                <span className="break-all">
                                    {user.email}
                                </span>
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <span
                                className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${roleStyles[user.role]}`}
                            >
                                {roleLabels[user.role]}
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${userStatusStyles[user.status]}`}
                            >
                                {userStatusLabels[user.status]}
                            </span>
                        </div>
                    </div>

                    <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays
                            aria-hidden="true"
                            className="size-3.5 text-accent"
                        />

                        Joined{" "}
                        {dateFormatter.format(
                            new Date(user.createdAt),
                        )}
                    </p>
                </div>
            </div>
        </article>
    );
}

type RecentPropertyItemProps = Readonly<{
    property: AdminProperty;
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
                        {currencyFormatter.format(
                            property.price,
                        )}
                    </p>

                    <p className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                        Total
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${propertyStatusStyles[property.status]}`}
                >
                    {propertyStatusLabels[property.status]}
                </span>

                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[0.68rem] font-bold text-muted-foreground">
                    {property.category.name}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <UserRound
                        aria-hidden="true"
                        className="size-3.5 text-brand"
                    />

                    Listed by {property.landlord.name}
                </span>

                <span className="inline-flex items-center gap-1.5">
                    <CalendarDays
                        aria-hidden="true"
                        className="size-3.5 text-brand"
                    />

                    {dateFormatter.format(
                        new Date(property.createdAt),
                    )}
                </span>
            </div>
        </article>
    );
}

export function AdminOverviewPanel() {
    const {
        data: users = [],
        error: usersError,
        isLoading: isUsersLoading,
        isFetching: isUsersFetching,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: adminUsersQueryKey,
        queryFn: getAdminUsers,
    });

    const {
        data: properties = [],
        error: propertiesError,
        isLoading: isPropertiesLoading,
        isFetching: isPropertiesFetching,
        refetch: refetchProperties,
    } = useQuery({
        queryKey: adminPropertiesQueryKey,
        queryFn: getAdminProperties,
    });

    const isLoading =
        isUsersLoading || isPropertiesLoading;

    const isFetching =
        isUsersFetching || isPropertiesFetching;

    const error =
        usersError || propertiesError;

    const activeUsers = users.filter(
        (user) => user.status === "ACTIVE",
    ).length;

    const bannedUsers = users.filter(
        (user) => user.status === "BANNED",
    ).length;

    const tenantCount = users.filter(
        (user) => user.role === "TENANT",
    ).length;

    const landlordCount = users.filter(
        (user) => user.role === "LANDLORD",
    ).length;

    const administratorCount = users.filter(
        (user) => user.role === "ADMIN",
    ).length;

    const availableProperties = properties.filter(
        (property) => property.status === "AVAILABLE",
    ).length;

    const rentedProperties = properties.filter(
        (property) => property.status === "RENTED",
    ).length;

    const unavailableProperties = properties.filter(
        (property) =>
            property.status === "UNAVAILABLE",
    ).length;

    const recentUsers = [...users]
        .sort(
            (firstUser, secondUser) =>
                new Date(secondUser.createdAt).getTime() -
                new Date(firstUser.createdAt).getTime(),
        )
        .slice(0, 5);

    const recentProperties = [...properties]
        .sort(
            (firstProperty, secondProperty) =>
                new Date(secondProperty.createdAt).getTime() -
                new Date(firstProperty.createdAt).getTime(),
        )
        .slice(0, 5);

    const errorMessage =
        error instanceof Error
            ? error.message
            : "The administrative overview could not be loaded.";

    function handleRetry() {
        void Promise.all([
            refetchUsers(),
            refetchProperties(),
        ]);
    }

    return (
        <section aria-labelledby="admin-overview-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-warning-soft lg:block"
                />

                <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-warning/20 bg-warning-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-warning">
                            Administrative workspace
                        </span>

                        <h1
                            id="admin-overview-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Monitor the complete
                            <span className="block text-brand">
                                RESTNEST marketplace.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Review platform accounts, access status,
                            property listings, ownership, and marketplace
                            availability from one administrative workspace.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/dashboard/admin/users"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                        >
                            <UsersRound
                                aria-hidden="true"
                                className="size-4"
                            />

                            Manage users
                        </Link>

                        <Link
                            href="/dashboard/admin/properties"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            Inspect properties

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

                    Updating administrative overview
                </div>
            )}

            {isLoading ? (
                <div className="mt-8">
                    <AdminOverviewSkeleton />
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
                        Overview unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Administrative data could not be loaded
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
                            label="Total users"
                            value={users.length}
                            description="Every registered RESTNEST platform account."
                            icon={UsersRound}
                            tone="brand"
                        />

                        <SummaryCard
                            label="Active users"
                            value={activeUsers}
                            description="Accounts currently permitted to access the platform."
                            icon={CheckCircle2}
                            tone="success"
                        />

                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            description="Every rental listing currently stored in RESTNEST."
                            icon={Building2}
                            tone="accent"
                        />

                        <SummaryCard
                            label="Available properties"
                            value={availableProperties}
                            description="Listings currently accepting new tenant requests."
                            icon={House}
                            tone="warning"
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Account composition
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        User breakdown
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Accounts grouped by role and access status.
                                    </p>
                                </div>

                                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                                    <UsersRound
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <BreakdownItem
                                    label="Tenants"
                                    value={tenantCount}
                                    icon={UserRound}
                                    tone="info"
                                />

                                <BreakdownItem
                                    label="Landlords"
                                    value={landlordCount}
                                    icon={Building2}
                                    tone="accent"
                                />

                                <BreakdownItem
                                    label="Administrators"
                                    value={administratorCount}
                                    icon={ShieldCheck}
                                    tone="warning"
                                />

                                <BreakdownItem
                                    label="Banned accounts"
                                    value={bannedUsers}
                                    icon={Ban}
                                    tone="danger"
                                />
                            </div>

                            <Link
                                href="/dashboard/admin/users"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Manage user accounts

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
                                        Marketplace inventory
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Property breakdown
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Listings grouped by their current availability.
                                    </p>
                                </div>

                                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                                    <ShieldCheck
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <BreakdownItem
                                    label="Available"
                                    value={availableProperties}
                                    icon={CheckCircle2}
                                    tone="success"
                                />

                                <BreakdownItem
                                    label="Rented"
                                    value={rentedProperties}
                                    icon={House}
                                    tone="info"
                                />

                                <BreakdownItem
                                    label="Unavailable"
                                    value={unavailableProperties}
                                    icon={CircleOff}
                                    tone="neutral"
                                />
                            </div>

                            <Link
                                href="/dashboard/admin/properties"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Inspect property listings

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </article>
                    </div>

                    <div className="mt-6 grid items-start gap-5 xl:grid-cols-2">
                        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
                            <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Newest accounts
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Recently registered users
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        The five newest RESTNEST accounts.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/admin/users"
                                    className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl px-2 text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
                                >
                                    View all

                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>

                            {recentUsers.length === 0 ? (
                                <div className="px-5 py-12 text-center sm:px-6">
                                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                                        <UsersRound
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-foreground">
                                        No registered users
                                    </h3>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Newly created platform accounts will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border px-5 py-5 sm:px-6">
                                    {recentUsers.map((user) => (
                                        <RecentUserItem
                                            key={user.id}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft">
                            <div className="flex flex-col gap-4 border-b border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                        Newest listings
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Recently listed properties
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        The five newest marketplace listings.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/admin/properties"
                                    className="inline-flex min-h-10 w-fit items-center gap-2 rounded-xl px-2 text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
                                >
                                    View all

                                    <ArrowRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </Link>
                            </div>

                            {recentProperties.length === 0 ? (
                                <div className="px-5 py-12 text-center sm:px-6">
                                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                                        <Building2
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-foreground">
                                        No property listings
                                    </h3>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Newly created property listings will appear here.
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
                    </div>
                </>
            )}
        </section>
    );
}