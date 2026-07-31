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
    LoaderCircle,
    Mail,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    UsersRound,
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

const dateFormatter =
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    });

const roleLabels: Record<
    UserRole,
    string
> = {
    TENANT: "Tenant",
    LANDLORD: "Landlord",
    ADMIN: "Administrator",
};

const roleStyles: Record<
    UserRole,
    string
> = {
    TENANT:
        "border-blue-700/25 bg-blue-100 text-blue-900 dark:border-blue-400/30 dark:bg-blue-950 dark:text-blue-200",
    LANDLORD:
        "border-violet-700/25 bg-violet-100 text-violet-900 dark:border-violet-400/30 dark:bg-violet-950 dark:text-violet-200",
    ADMIN:
        "border-amber-700/25 bg-amber-100 text-amber-900 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-200",
};

const statusStyles: Record<
    UserStatus,
    string
> = {
    ACTIVE:
        "border-emerald-700/25 bg-emerald-100 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-200",
    BANNED:
        "border-red-700/25 bg-red-100 text-red-900 dark:border-red-400/30 dark:bg-red-950 dark:text-red-200",
};

type SummaryCardProps = Readonly<{
    label: string;
    value: number;
    icon: typeof UsersRound;
}>;

function SummaryCard({
    label,
    value,
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

            <p className="mt-4 text-sm font-medium text-muted-foreground">
                {label}
            </p>
        </article>
    );
}

type UserStatusButtonProps =
    Readonly<{
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
            <span className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface-muted px-4 text-xs font-semibold text-muted-foreground">
                Current account
            </span>
        );
    }

    const nextStatus: UserStatus =
        user.status === "ACTIVE"
            ? "BANNED"
            : "ACTIVE";

    const label =
        nextStatus === "BANNED"
            ? "Ban user"
            : "Activate user";

    return (
        <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
                onUpdate(user, nextStatus)
            }
            className={
                nextStatus === "BANNED"
                    ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-300 bg-background px-4 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
                    : "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-xs font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            }
        >
            {isUpdating ? (
                <LoaderCircle
                    aria-hidden="true"
                    className="size-4 animate-spin"
                />
            ) : nextStatus === "BANNED" ? (
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
                : label}
        </button>
    );
}

export function AdminUsersPanel() {
    const queryClient = useQueryClient();
    const { data: sessionUser } =
        useSession();

    const [searchValue, setSearchValue] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState<UserRole | "ALL">("ALL");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState<UserStatus | "ALL">(
        "ALL",
    );

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
            queryClient.setQueryData<
                AdminUser[]
            >(
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
                title:
                    "User status update failed",
                description:
                    mutationError instanceof Error
                        ? mutationError.message
                        : "The user could not be updated.",
            });
        },
    });

    const normalizedSearch =
        searchValue.trim().toLowerCase();

    const filteredUsers = users.filter(
        (user) => {
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
        },
    );

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredUsers.length /
            pageSize,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) *
        pageSize;

    const visibleUsers =
        filteredUsers.slice(
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

    function resetPage() {
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

    const errorMessage =
        error instanceof Error
            ? error.message
            : "The user list could not be loaded.";

    return (
        <section>
            <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        User administration
                    </p>

                    <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        Manage users
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                        Inspect tenant, landlord, and
                        administrator accounts and manage
                        account access.
                    </p>
                </div>

                {isFetching && !isLoading && (
                    <p
                        role="status"
                        className="text-sm font-medium text-brand"
                    >
                        Updating users...
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

                    <div className="mt-8 h-96 animate-pulse rounded-[2rem] border border-border bg-surface-muted" />
                </>
            ) : error ? (
                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-7 text-brand"
                    />

                    <h2 className="mt-5 text-xl font-semibold text-foreground">
                        Users could not be loaded
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
                        <SummaryCard
                            label="Total users"
                            value={users.length}
                            icon={UsersRound}
                        />

                        <SummaryCard
                            label="Active accounts"
                            value={activeUsers}
                            icon={CheckCircle2}
                        />

                        <SummaryCard
                            label="Banned accounts"
                            value={bannedUsers}
                            icon={Ban}
                        />

                        <SummaryCard
                            label="Landlords"
                            value={landlordUsers}
                            icon={ShieldCheck}
                        />
                    </div>

                    <div className="mt-8 rounded-[2rem] border border-border bg-surface">
                        <div className="grid gap-3 border-b border-border p-5 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
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
                                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
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
                                className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-focus"
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
                                className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none focus:border-focus"
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

                        {visibleUsers.length === 0 ? (
                            <div className="p-10 text-center">
                                <UsersRound
                                    aria-hidden="true"
                                    className="mx-auto size-8 text-brand"
                                />

                                <h2 className="mt-4 text-lg font-semibold text-foreground">
                                    No users found
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Try changing the search or
                                    filter values.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {visibleUsers.map((user) => {
                                    const isUpdating =
                                        statusMutation.isPending &&
                                        statusMutation.variables
                                            ?.userId === user.id;

                                    return (
                                        <article
                                            key={user.id}
                                            className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] lg:items-center"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                                                    <UserRound
                                                        aria-hidden="true"
                                                        className="size-5"
                                                    />
                                                </span>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-foreground">
                                                        {user.name}
                                                    </p>

                                                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                                                        <Mail
                                                            aria-hidden="true"
                                                            className="size-4 shrink-0"
                                                        />

                                                        {user.email}
                                                    </p>

                                                    {user.phone && (
                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {user.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${roleStyles[user.role]}`}
                                                    >
                                                        {roleLabels[
                                                            user.role
                                                        ]}
                                                    </span>

                                                    <span
                                                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[user.status]}`}
                                                    >
                                                        {user.status ===
                                                            "ACTIVE"
                                                            ? "Active"
                                                            : "Banned"}
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-xs text-muted-foreground">
                                                    Joined{" "}
                                                    {dateFormatter.format(
                                                        new Date(
                                                            user.createdAt,
                                                        ),
                                                    )}
                                                </p>
                                            </div>

                                            <UserStatusButton
                                                user={user}
                                                currentAdminId={
                                                    sessionUser?.id
                                                }
                                                isUpdating={
                                                    isUpdating
                                                }
                                                onUpdate={
                                                    handleStatusUpdate
                                                }
                                            />
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 border-t border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing{" "}
                                {filteredUsers.length === 0
                                    ? 0
                                    : startIndex + 1}
                                –
                                {Math.min(
                                    startIndex + pageSize,
                                    filteredUsers.length,
                                )}{" "}
                                of {filteredUsers.length}
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
                                    disabled={
                                        safeCurrentPage === 1
                                    }
                                    aria-label="Previous page"
                                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>

                                <span className="min-w-24 text-center text-sm font-medium text-foreground">
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
                                        safeCurrentPage ===
                                        totalPages
                                    }
                                    aria-label="Next page"
                                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}