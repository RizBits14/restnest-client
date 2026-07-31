"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    LayoutDashboard,
    LoaderCircle,
    LogOut,
    UserRound,
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

type AuthActionsProps = Readonly<{
    variant: "desktop" | "mobile";
    onNavigate?: () => void;
}>;

export function AuthActions({
    variant,
    onNavigate,
}: AuthActionsProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useSession();

    const [isLoggingOut, setIsLoggingOut] =
        useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);

        try {
            const message = await logoutUser();

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
                    className="h-24 animate-pulse rounded-2xl bg-surface-muted"
                />
            );
        }

        return (
            <div
                aria-label="Checking authentication"
                className="flex items-center gap-2"
            >
                <div className="size-10 animate-pulse rounded-xl bg-surface-muted" />
                <div className="h-10 w-24 animate-pulse rounded-xl bg-surface-muted" />
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
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/auth/register"
                        onClick={onNavigate}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90"
                    >
                        Create account
                    </Link>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/auth/login"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                >
                    Log in
                </Link>

                <Link
                    href="/auth/register"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90"
                >
                    Create account
                </Link>
            </div>
        );
    }

    const dashboardPath = getDashboardPath(user.role);

    if (variant === "mobile") {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                        <UserRound
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {roleLabels[user.role]}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href={dashboardPath}
                        onClick={onNavigate}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90"
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
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
                    >
                        {isLoggingOut ? (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        ) : (
                            <LogOut
                                aria-hidden="true"
                                className="size-4"
                            />
                        )}

                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
                <span className="grid size-7 place-items-center rounded-lg bg-surface-muted text-brand">
                    <UserRound
                        aria-hidden="true"
                        className="size-4"
                    />
                </span>

                <div className="max-w-32">
                    <p className="truncate text-xs font-semibold text-foreground">
                        {user.name}
                    </p>

                    <p className="text-[0.7rem] text-muted-foreground">
                        {roleLabels[user.role]}
                    </p>
                </div>
            </div>

            <Link
                href={dashboardPath}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90 lg:px-4"
            >
                <LayoutDashboard
                    aria-hidden="true"
                    className="size-4"
                />

                <span>
                    Dashboard
                </span>
            </Link>

            <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-label="Sign out"
                className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
            >
                {isLoggingOut ? (
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                    />
                ) : (
                    <LogOut
                        aria-hidden="true"
                        className="size-4"
                    />
                )}
            </button>
        </div>
    );
}