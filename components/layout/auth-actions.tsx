"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    LayoutDashboard,
    LoaderCircle,
    LogIn,
    LogOut,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toaster } from "@/components/ui/app-toaster";
import {
    sessionQueryKey,
    useSession,
} from "@/hooks/use-session";
import { logoutUser } from "@/lib/api/auth-client";
import { getDashboardPath } from "@/lib/auth/get-dashboard-path";
import type { UserRole } from "@/types/auth";

const roleLabels: Record<UserRole, string> = {
    TENANT: "Tenant",
    LANDLORD: "Landlord",
    ADMIN: "Admin",
};

const roleBadgeClasses: Record<UserRole, string> = {
    TENANT: "bg-info-soft text-info",
    LANDLORD: "bg-accent-soft text-accent",
    ADMIN: "bg-warning-soft text-warning",
};

type AuthActionsProps = Readonly<{
    variant: "desktop" | "mobile";
    onNavigate?: () => void;
}>;

function getUserInitial(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
        return "U";
    }

    return normalizedName.charAt(0).toUpperCase();
}

export function AuthActions({
    variant,
    onNavigate,
}: AuthActionsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useSession();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            const message = await logoutUser();

            queryClient.clear();

            queryClient.setQueryData(
                sessionQueryKey,
                null,
            );

            toaster.success({
                title: "Signed out successfully",
                description: message,
            });

            onNavigate?.();
            router.replace("/");
            router.refresh();
        } catch (error) {
            toaster.error({
                title: "Sign out failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Unable to sign out. Please try again.",
            });
        } finally {
            setIsLoggingOut(false);
        }
    }

    if (isLoading) {
        if (variant === "mobile") {
            return (
                <div
                    aria-label="Checking authentication"
                    className="space-y-3"
                >
                    <div className="h-20 animate-pulse rounded-2xl bg-surface-muted" />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
                        <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
                    </div>
                </div>
            );
        }

        return (
            <div
                aria-label="Checking authentication"
                className="flex items-center gap-2"
            >
                <div className="h-10 w-32 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-10 w-28 animate-pulse rounded-xl bg-surface-muted" />
                <div className="size-10 animate-pulse rounded-xl bg-surface-muted" />
            </div>
        );
    }

    if (!user) {
        if (variant === "mobile") {
            return (
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/auth/login"
                        onClick={onNavigate}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                    >
                        <LogIn aria-hidden="true" className="size-4" />
                        Log in
                    </Link>

                    <Link
                        href="/auth/register"
                        onClick={onNavigate}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                    >
                        <UserPlus aria-hidden="true" className="size-4" />
                        Sign up
                    </Link>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/auth/login"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                >
                    <LogIn aria-hidden="true" className="size-4" />
                    Log in
                </Link>

                <Link
                    href="/auth/register"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                >
                    <UserPlus aria-hidden="true" className="size-4" />
                    Create account
                </Link>
            </div>
        );
    }

    const dashboardPath = getDashboardPath(user.role);

    if (variant === "mobile") {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-subtle p-3">
                    <span
                        aria-hidden="true"
                        className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand"
                    >
                        {getUserInitial(user.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                        </p>

                        <span
                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${roleBadgeClasses[user.role]}`}
                        >
                            {roleLabels[user.role]}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={dashboardPath}
                        onClick={onNavigate}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                    >
                        <LayoutDashboard
                            aria-hidden="true"
                            className="size-4"
                        />
                        Dashboard
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-danger/40 hover:bg-danger-soft hover:text-danger disabled:cursor-wait disabled:opacity-60"
                    >
                        {isLoggingOut ? (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        ) : (
                            <LogOut aria-hidden="true" className="size-4" />
                        )}

                        {isLoggingOut ? "Signing out" : "Sign out"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-surface-subtle px-2.5 py-1.5">
                <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-xs font-bold text-brand"
                >
                    {getUserInitial(user.name)}
                </span>

                <div className="min-w-0 max-w-28">
                    <p className="truncate text-xs font-semibold text-foreground">
                        {user.name}
                    </p>

                    <p
                        className={`mt-0.5 w-fit rounded-full px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] ${roleBadgeClasses[user.role]}`}
                    >
                        {roleLabels[user.role]}
                    </p>
                </div>
            </div>

            <Link
                href={dashboardPath}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active xl:px-4"
            >
                <LayoutDashboard
                    aria-hidden="true"
                    className="size-4"
                />
                <span>Dashboard</span>
            </Link>

            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label={isLoggingOut ? "Signing out" : "Sign out"}
                title={isLoggingOut ? "Signing out" : "Sign out"}
                className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:border-danger/40 hover:bg-danger-soft hover:text-danger disabled:cursor-wait disabled:opacity-60"
            >
                {isLoggingOut ? (
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                    />
                ) : (
                    <LogOut aria-hidden="true" className="size-4" />
                )}
            </button>
        </div>
    );
}