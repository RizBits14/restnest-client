"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    House,
    Mail,
    MapPin,
    RefreshCw,
    ShieldCheck,
    UserRound,
    UsersRound,
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
import type { AdminProperty, AdminUser } from "@/types/admin";
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
    TENANT:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    LANDLORD:
        "border-violet-700/25 bg-violet-100 text-violet-900 dark:border-violet-400/30 dark:bg-violet-950 dark:text-violet-200",
    ADMIN:
        "border-amber-700/25 bg-amber-100 text-amber-900 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-200",
};

const userStatusStyles: Record<UserStatus, string> = {
    ACTIVE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    BANNED:
        "border-red-700/25 bg-red-100 text-red-900 dark:border-red-400/30 dark:bg-red-950 dark:text-red-200",
};

const propertyStatusLabels: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    RENTED: "Rented",
    UNAVAILABLE: "Unavailable",
};

const propertyStatusStyles: Record<PropertyStatus, string> = {
    AVAILABLE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    RENTED:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    UNAVAILABLE:
        "border-zinc-600/25 bg-zinc-200 text-zinc-900 dark:border-zinc-400/30 dark:bg-zinc-800 dark:text-zinc-100",
};

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    description: string;
    icon: typeof UsersRound;
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
}>;

function BreakdownItem({
    label,
    value,
}: BreakdownItemProps) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="text-sm font-semibold text-foreground">
                {value}
            </p>
        </div>
    );
}

function OverviewSkeleton() {
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
                            className="h-72 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
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

type RecentUserItemProps = Readonly<{
    user: AdminUser;
}>;

function RecentUserItem({
    user,
}: RecentUserItemProps) {
    return (
        <article className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                <UserRound
                    aria-hidden="true"
                    className="size-5"
                />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <Mail
                                aria-hidden="true"
                                className="size-3.5 shrink-0"
                            />
                            {user.email}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                        >
                            {roleLabels[user.role]}
                        </span>

                        <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${userStatusStyles[user.status]}`}
                        >
                            {user.status === "ACTIVE"
                                ? "Active"
                                : "Banned"}
                        </span>
                    </div>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays
                        aria-hidden="true"
                        className="size-3.5 text-brand"
                    />
                    Joined{" "}
                    {dateFormatter.format(
                        new Date(user.createdAt),
                    )}
                </p>
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
                    {currencyFormatter.format(
                        property.price,
                    )}
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

                <span className="text-xs text-muted-foreground">
                    By {property.landlord.name}
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
        isUsersLoading ||
        isPropertiesLoading;

    const isFetching =
        isUsersFetching ||
        isPropertiesFetching;

    const error =
        usersError ||
        propertiesError;

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
        (property) => property.status === "UNAVAILABLE",
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
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Administrative workspace
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Marketplace overview
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Monitor RESTNEST users, account access,
                        property listings, and marketplace
                        availability from one dashboard.
                    </p>
                </div>

                {isFetching && !isLoading && (
                    <p
                        role="status"
                        className="text-sm font-medium text-brand"
                    >
                        Updating overview...
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="mt-8">
                    <OverviewSkeleton />
                </div>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-8 text-brand"
                    />

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Overview could not be loaded
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
                            label="Total users"
                            value={users.length}
                            description="All registered platform accounts."
                            icon={UsersRound}
                        />

                        <SummaryCard
                            label="Active users"
                            value={activeUsers}
                            description="Accounts currently allowed to access RESTNEST."
                            icon={CheckCircle2}
                        />

                        <SummaryCard
                            label="Total properties"
                            value={properties.length}
                            description="All marketplace property listings."
                            icon={Building2}
                        />

                        <SummaryCard
                            label="Available properties"
                            value={availableProperties}
                            description="Listings currently accepting requests."
                            icon={House}
                        />
                    </div>

                    <div className="mt-6 grid gap-5 xl:grid-cols-2">
                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        User breakdown
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Accounts grouped by role and status.
                                    </p>
                                </div>

                                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                                    <UsersRound
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <BreakdownItem
                                    label="Tenants"
                                    value={tenantCount}
                                />

                                <BreakdownItem
                                    label="Landlords"
                                    value={landlordCount}
                                />

                                <BreakdownItem
                                    label="Administrators"
                                    value={administratorCount}
                                />

                                <BreakdownItem
                                    label="Banned accounts"
                                    value={bannedUsers}
                                />
                            </div>

                            <Link
                                href="/dashboard/admin/users"
                                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                            >
                                Manage users
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-brand"
                                />
                            </Link>
                        </article>

                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Property breakdown
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Listings grouped by availability.
                                    </p>
                                </div>

                                <span className="grid size-11 place-items-center rounded-xl bg-surface-muted text-brand">
                                    <ShieldCheck
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3">
                                <BreakdownItem
                                    label="Available"
                                    value={availableProperties}
                                />

                                <BreakdownItem
                                    label="Rented"
                                    value={rentedProperties}
                                />

                                <BreakdownItem
                                    label="Unavailable"
                                    value={unavailableProperties}
                                />
                            </div>

                            <Link
                                href="/dashboard/admin/properties"
                                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                            >
                                Inspect properties
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
                                        Recently registered users
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        The newest RESTNEST accounts.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/admin/users"
                                    className="text-sm font-semibold text-brand hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentUsers.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No registered users found.
                                </p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentUsers.map((user) => (
                                        <RecentUserItem
                                            key={user.id}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Recently listed properties
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        The newest marketplace listings.
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/admin/properties"
                                    className="text-sm font-semibold text-brand hover:underline"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentProperties.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No property listings found.
                                </p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentProperties.map(
                                        (property) => (
                                            <RecentPropertyItem
                                                key={property.id}
                                                property={property}
                                            />
                                        ),
                                    )}
                                </div>
                            )}
                        </article>
                    </div>
                </>
            )}
        </section>
    );
}