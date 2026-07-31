"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    LayoutDashboard,
    Building2,
    LoaderCircle,
    LogOut,
    Menu,
    UserRound,
    ClipboardList,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { toaster } from "@/components/ui/app-toaster";
import {
    sessionQueryKey,
} from "@/hooks/use-session";
import { logoutUser } from "@/lib/api/auth-client";
import type {
    AuthUser,
    UserRole,
} from "@/types/auth";

const roleLabels: Record<UserRole, string> = {
    TENANT: "Tenant",
    LANDLORD: "Landlord",
    ADMIN: "Administrator",
};

const dashboardNavigation = {
    TENANT: [
        {
            label: "Overview",
            href: "/dashboard/tenant",
            icon: LayoutDashboard,
        },
    ],

    LANDLORD: [
        {
            label: "Overview",
            href: "/dashboard/landlord",
            icon: LayoutDashboard,
        },
        {
            label: "Properties",
            href: "/dashboard/landlord/properties",
            icon: Building2,
        },
        {
            label: "Requests",
            href: "/dashboard/landlord/requests",
            icon: ClipboardList,
        },
    ],

    ADMIN: [
        {
            label: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
        },
    ],
} as const;

type DashboardShellProps = Readonly<{
    user: AuthUser;
    children: React.ReactNode;
}>;

export function DashboardShell({
    user,
    children,
}: DashboardShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    const [isLoggingOut, setIsLoggingOut] =
        useState(false);

    const navigationItems = dashboardNavigation[user.role];

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

            setIsSidebarOpen(false);
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

    const navigation = (
        <nav
            aria-label="Dashboard navigation"
            className="mt-8 space-y-1"
        >
            {navigationItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard/landlord" &&
                        pathname.startsWith(`${item.href}/`));

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={
                            isActive
                                ? "flex items-center gap-3 rounded-xl bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground"
                                : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                        }
                    >
                        <Icon
                            aria-hidden="true"
                            className="size-5 text-brand"
                        />

                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    const accountPanel = (
        <div className="mt-auto border-t border-border pt-5">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
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

            <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <div className="flex h-11 items-center rounded-xl border border-border bg-background px-1">
                    <ThemeToggle />
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                        Change theme
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-label="Sign out"
                    className="grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
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
        </div>
    );

    return (
        <div className="min-h-svh bg-background">
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-border bg-surface p-5 lg:flex">
                <SiteLogo />

                <div className="mt-8 rounded-2xl border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                        RESTNEST workspace
                    </p>

                    <p className="mt-2 text-sm font-semibold text-foreground">
                        {roleLabels[user.role]} dashboard
                    </p>
                </div>

                {navigation}
                {accountPanel}
            </aside>

            <div className="min-w-0 lg:pl-72">
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6 lg:hidden">
                    <SiteLogo />

                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open dashboard navigation"
                            aria-expanded={isSidebarOpen}
                            className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
                        >
                            <Menu
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                    </div>
                </header>

                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <button
                            type="button"
                            aria-label="Close dashboard navigation"
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
                        />

                        <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border bg-surface p-5 shadow-[18px_0_60px_rgba(20,30,24,0.18)]">
                            <div className="flex items-center justify-between gap-4">
                                <SiteLogo />

                                <button
                                    type="button"
                                    onClick={() => setIsSidebarOpen(false)}
                                    aria-label="Close dashboard navigation"
                                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-muted"
                                >
                                    <X
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>
                            </div>

                            <div className="mt-8 rounded-2xl border border-border bg-background p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                                    RESTNEST workspace
                                </p>

                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {roleLabels[user.role]} dashboard
                                </p>
                            </div>

                            {navigation}
                            {accountPanel}
                        </aside>
                    </div>
                )}

                <main className="mx-auto w-full max-w-[92rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                    {children}
                </main>
            </div>
        </div>
    );
}