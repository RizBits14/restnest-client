"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FilterX,
    LoaderCircle,
    Mail,
    Phone,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    UsersRound,
    type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { toaster } from "@/components/ui/app-toaster";
import { useSession } from "@/hooks/use-session";
import {
    adminUsersQueryKey,
    getAdminUsers,
    updateAdminUserStatus,
} from "@/lib/api/admin-users-client";
import type { AdminUser } from "@/types/admin";
import type {
    UserRole,
    UserStatus,
} from "@/types/auth";

const pageSize = 8;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
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

const statusLabels: Record<UserStatus, string> = {
    ACTIVE: "Active",
    BANNED: "Banned",
};

const statusStyles: Record<UserStatus, string> = {
    ACTIVE: "bg-success-soft text-success",
    BANNED: "bg-danger-soft text-danger",
};

type SummaryTone =
    | "brand"
    | "success"
    | "danger"
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
    danger: {
        icon: "bg-danger-soft text-danger",
        value: "text-danger",
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

type UserStatusButtonProps = Readonly<{
    user: AdminUser;
    currentAdminId?: string;
    isUpdating: boolean;
    onUpdate: (
        user: AdminUser,
        status: UserStatus,
    ) => void;
}>;

function UserStatusButton({
    user,
    currentAdminId,
    isUpdating,
    onUpdate,
}: UserStatusButtonProps) {
    const isCurrentAdmin =
        user.id === currentAdminId;

    if (isCurrentAdmin) {
        return (
            <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-warning/20 bg-warning-soft px-4 text-xs font-bold text-warning">
                <ShieldCheck
                    aria-hidden="true"
                    className="size-4"
                />

                Current account
            </span>
        );
    }

    const nextStatus: UserStatus =
        user.status === "ACTIVE"
            ? "BANNED"
            : "ACTIVE";

    const isBanAction =
        nextStatus === "BANNED";

    return (
        <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
                onUpdate(user, nextStatus)
            }
            className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors duration-200",
                "disabled:cursor-wait disabled:opacity-60",
                isBanAction
                    ? "border border-danger/25 bg-background text-danger hover:border-danger/40 hover:bg-danger-soft"
                    : "bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-active",
            ].join(" ")}
        >
            {isUpdating ? (
                <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                />
            ) : isBanAction ? (
                <Ban
                    aria-hidden="true"
                    className="size-4"
                />
            ) : (
                <CheckCircle2
                    aria-hidden="true"
                    className="size-4"
                />
            )}

            {isUpdating
                ? "Updating..."
                : isBanAction
                    ? "Ban user"
                    : "Activate user"}
        </button>
    );
}

function AdminUsersSkeleton() {
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

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-surface">
                <div className="h-28 animate-pulse border-b border-border bg-surface-muted" />

                <div className="divide-y divide-border">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={index}
                            className="h-28 animate-pulse bg-surface"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

type UserRowProps = Readonly<{
    user: AdminUser;
    currentAdminId?: string;
    isUpdating: boolean;
    onStatusUpdate: (
        user: AdminUser,
        status: UserStatus,
    ) => void;
}>;

function UserRow({
    user,
    currentAdminId,
    isUpdating,
    onStatusUpdate,
}: UserRowProps) {
    return (
        <article className="grid gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_auto] lg:items-center sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <UserRound
                        aria-hidden="true"
                        className="size-5"
                    />
                </span>

                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                        {user.name}
                    </p>

                    <p className="mt-1.5 flex items-start gap-2 text-sm leading-5 text-muted-foreground">
                        <Mail
                            aria-hidden="true"
                            className="mt-0.5 size-4 shrink-0 text-brand"
                        />

                        <span className="break-all">
                            {user.email}
                        </span>
                    </p>

                    {user.phone && (
                        <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone
                                aria-hidden="true"
                                className="size-4 shrink-0 text-accent"
                            />

                            {user.phone}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex flex-wrap gap-2">
                    <span
                        className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${roleStyles[user.role]}`}
                    >
                        {roleLabels[user.role]}
                    </span>

                    <span
                        className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.07em] ${statusStyles[user.status]}`}
                    >
                        {statusLabels[user.status]}
                    </span>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                    Joined{" "}
                    {dateFormatter.format(
                        new Date(user.createdAt),
                    )}
                </p>
            </div>

            <UserStatusButton
                user={user}
                currentAdminId={currentAdminId}
                isUpdating={isUpdating}
                onUpdate={onStatusUpdate}
            />
        </article>
    );
}

export function AdminUsersPanel() {
    const queryClient = useQueryClient();
    const { data: sessionUser } = useSession();

    const [searchValue, setSearchValue] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState<UserRole | "ALL">("ALL");

    const [statusFilter, setStatusFilter] =
        useState<UserStatus | "ALL">("ALL");

    const [currentPage, setCurrentPage] =
        useState(1);

    const {
        data: users = [],
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: adminUsersQueryKey,
        queryFn: getAdminUsers,
    });

    const statusMutation = useMutation({
        mutationFn: updateAdminUserStatus,

        onSuccess: (updatedUser) => {
            queryClient.setQueryData<AdminUser[]>(
                adminUsersQueryKey,
                (currentUsers = []) =>
                    currentUsers.map((user) =>
                        user.id === updatedUser.id
                            ? updatedUser
                            : user,
                    ),
            );

            toaster.success({
                title: "User status updated",
                description: `${updatedUser.name} is now ${updatedUser.status.toLowerCase()}.`,
            });
        },

        onError: (mutationError) => {
            toaster.error({
                title: "User status update failed",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "The user could not be updated.",
            });
        },
    });

    const normalizedSearch =
        searchValue.trim().toLowerCase();

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            !normalizedSearch ||
            user.name
                .toLowerCase()
                .includes(normalizedSearch) ||
            user.email
                .toLowerCase()
                .includes(normalizedSearch);

        const matchesRole =
            roleFilter === "ALL" ||
            user.role === roleFilter;

        const matchesStatus =
            statusFilter === "ALL" ||
            user.status === statusFilter;

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
        );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / pageSize),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) * pageSize;

    const visibleUsers = filteredUsers.slice(
        startIndex,
        startIndex + pageSize,
    );

    const activeUsers = users.filter(
        (user) => user.status === "ACTIVE",
    ).length;

    const bannedUsers = users.filter(
        (user) => user.status === "BANNED",
    ).length;

    const landlordUsers = users.filter(
        (user) => user.role === "LANDLORD",
    ).length;

    const hasActiveFilters =
        searchValue.trim().length > 0 ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL";

    const errorMessage =
        error instanceof Error
            ? error.message
            : "The user list could not be loaded.";

    function resetPage() {
        setCurrentPage(1);
    }

    function clearFilters() {
        setSearchValue("");
        setRoleFilter("ALL");
        setStatusFilter("ALL");
        setCurrentPage(1);
    }

    function handleStatusUpdate(
        user: AdminUser,
        status: UserStatus,
    ) {
        const action =
            status === "BANNED"
                ? "ban"
                : "activate";

        const isConfirmed = window.confirm(
            `Are you sure you want to ${action} ${user.name}?`,
        );

        if (!isConfirmed) {
            return;
        }

        statusMutation.mutate({
            userId: user.id,
            status,
        });
    }

    return (
        <section aria-labelledby="admin-users-title">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-warning-soft lg:block"
                />

                <div className="relative max-w-3xl">
                    <span className="inline-flex rounded-full border border-warning/20 bg-warning-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-warning">
                        User administration
                    </span>

                    <h1
                        id="admin-users-title"
                        className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        Manage platform access
                        <span className="block text-brand">
                            responsibly and clearly.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                        Search tenant, landlord, and administrator
                        accounts, review account information, and
                        control active or banned access status.
                    </p>
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

                    Updating users
                </div>
            )}

            {isLoading ? (
                <div className="mt-8">
                    <AdminUsersSkeleton />
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
                        Users unavailable
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Users could not be loaded
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
                            description="Every account registered on RESTNEST."
                            icon={UsersRound}
                            tone="brand"
                        />

                        <SummaryCard
                            label="Active accounts"
                            value={activeUsers}
                            description="Users currently permitted to access the platform."
                            icon={CheckCircle2}
                            tone="success"
                        />

                        <SummaryCard
                            label="Banned accounts"
                            value={bannedUsers}
                            description="Accounts currently restricted from platform access."
                            icon={Ban}
                            tone="danger"
                        />

                        <SummaryCard
                            label="Landlords"
                            value={landlordUsers}
                            description="Property-owner accounts registered on RESTNEST."
                            icon={ShieldCheck}
                            tone="accent"
                        />
                    </div>

                    <article className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft">
                        <div className="border-b border-border bg-surface-subtle p-5 sm:p-6">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Account directory
                                    </p>

                                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em] text-foreground">
                                        Search and filter users
                                    </h2>

                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                        Filter accounts by identity, role, or
                                        access status.
                                    </p>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold text-muted-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                    >
                                        <FilterX
                                            aria-hidden="true"
                                            className="size-4"
                                        />

                                        Clear filters
                                    </button>
                                )}
                            </div>

                            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
                                <div className="relative">
                                    <Search
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                    />

                                    <input
                                        type="search"
                                        value={searchValue}
                                        onChange={(event) => {
                                            setSearchValue(
                                                event.target.value,
                                            );
                                            resetPage();
                                        }}
                                        placeholder="Search name or email"
                                        aria-label="Search users"
                                        className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                                    />
                                </div>

                                <select
                                    value={roleFilter}
                                    onChange={(event) => {
                                        setRoleFilter(
                                            event.target.value as
                                            | UserRole
                                            | "ALL",
                                        );
                                        resetPage();
                                    }}
                                    aria-label="Filter by role"
                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                                >
                                    <option value="ALL">
                                        All roles
                                    </option>

                                    <option value="TENANT">
                                        Tenants
                                    </option>

                                    <option value="LANDLORD">
                                        Landlords
                                    </option>

                                    <option value="ADMIN">
                                        Administrators
                                    </option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setStatusFilter(
                                            event.target.value as
                                            | UserStatus
                                            | "ALL",
                                        );
                                        resetPage();
                                    }}
                                    aria-label="Filter by status"
                                    className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10"
                                >
                                    <option value="ALL">
                                        All statuses
                                    </option>

                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="BANNED">
                                        Banned
                                    </option>
                                </select>
                            </div>
                        </div>

                        {visibleUsers.length === 0 ? (
                            <div className="px-5 py-12 text-center sm:px-6">
                                <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-brand-soft text-brand">
                                    <UsersRound
                                        aria-hidden="true"
                                        className="size-7"
                                    />
                                </span>

                                <h2 className="mt-5 text-xl font-bold tracking-[-0.025em] text-foreground">
                                    No users found
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                                    Adjust the search term or filter values to
                                    find a different account.
                                </p>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                    >
                                        <FilterX
                                            aria-hidden="true"
                                            className="size-4"
                                        />

                                        Reset filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {visibleUsers.map((user) => {
                                    const isUpdating =
                                        statusMutation.isPending &&
                                        statusMutation.variables
                                            ?.userId === user.id;

                                    return (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            currentAdminId={
                                                sessionUser?.id
                                            }
                                            isUpdating={isUpdating}
                                            onStatusUpdate={
                                                handleStatusUpdate
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-border bg-surface-subtle p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-muted-foreground">
                                Showing{" "}
                                <strong className="font-bold text-foreground">
                                    {filteredUsers.length === 0
                                        ? 0
                                        : startIndex + 1}
                                    –
                                    {Math.min(
                                        startIndex + pageSize,
                                        filteredUsers.length,
                                    )}
                                </strong>{" "}
                                of{" "}
                                <strong className="font-bold text-foreground">
                                    {filteredUsers.length}
                                </strong>
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.max(
                                                1,
                                                safeCurrentPage - 1,
                                            ),
                                        )
                                    }
                                    disabled={safeCurrentPage === 1}
                                    aria-label="Previous page"
                                    className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>

                                <span className="min-w-28 text-center text-sm font-bold text-foreground">
                                    Page {safeCurrentPage} of{" "}
                                    {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(
                                            Math.min(
                                                totalPages,
                                                safeCurrentPage + 1,
                                            ),
                                        )
                                    }
                                    disabled={
                                        safeCurrentPage === totalPages
                                    }
                                    aria-label="Next page"
                                    className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>
                            </div>
                        </div>
                    </article>
                </>
            )}
        </section>
    );
}