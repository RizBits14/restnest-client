"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
    Building2,
    ClipboardList,
    LayoutDashboard,
    LoaderCircle,
    LogOut,
    Menu,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";
import Link from "next/link";
import {
    usePathname,
    useRouter,
} from "next/navigation";
import { useState } from "react";

import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { toaster } from "@/components/ui/app-toaster";
import { sessionQueryKey } from "@/hooks/use-session";
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

const roleDescriptions: Record<UserRole, string> = {
    TENANT:
        "Track requests, payments, and completed rentals.",
    LANDLORD:
        "Manage listings and respond to tenant requests.",
    ADMIN:
        "Oversee users, properties, and platform activity.",
};

const roleBadgeClasses: Record<UserRole, string> = {
    TENANT: "bg-info-soft text-info",
    LANDLORD: "bg-accent-soft text-accent",
    ADMIN: "bg-warning-soft text-warning",
};

const dashboardNavigation = {
    TENANT: [
        {
            label: "Overview",
            href: "/dashboard/tenant",
            icon: LayoutDashboard,
        },
        {
            label: "My rentals",
            href: "/dashboard/tenant/rentals",
            icon: ClipboardList,
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
        {
            label: "Users",
            href: "/dashboard/admin/users",
            icon: UsersRound,
        },
        {
            label: "Properties",
            href: "/dashboard/admin/properties",
            icon: Building2,
        },
    ],
} as const;

type DashboardShellProps = Readonly<{
    user: AuthUser;
    children: React.ReactNode;
}>;

function getUserInitial(name: string) {
    const normalizedName = name.trim();

    return normalizedName
        ? normalizedName.charAt(0).toUpperCase()
        : "U";
}

function isNavigationItemActive(
    pathname: string,
    itemHref: string,
    dashboardRoot: string,
) {
    return (
        pathname === itemHref ||
        (itemHref !== dashboardRoot &&
            pathname.startsWith(`${itemHref}/`))
    );
}

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

    const navigationItems =
        dashboardNavigation[user.role];

    const roleDashboardRoot =
        `/dashboard/${user.role.toLowerCase()}`;

    const activeNavigationItem =
        navigationItems.find((item) =>
            isNavigationItemActive(
                pathname,
                item.href,
                roleDashboardRoot,
            ),
        ) ?? navigationItems[0];

    function closeSidebar() {
        setIsSidebarOpen(false);
    }

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

            closeSidebar();
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
            className="mt-7 space-y-1.5"
        >
            <p className="px-3 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Workspace
            </p>

            <div className="mt-3 space-y-1.5">
                {navigationItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        isNavigationItemActive(
                            pathname,
                            item.href,
                            roleDashboardRoot,
                        );

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            aria-current={
                                isActive ? "page" : undefined
                            }
                            className={[
                                "group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200",
                                isActive
                                    ? "bg-brand-soft text-brand"
                                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                            ].join(" ")}
                        >
                            <span
                                className={[
                                    "grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-200",
                                    isActive
                                        ? "bg-brand text-brand-foreground"
                                        : "bg-surface-muted text-brand group-hover:bg-surface",
                                ].join(" ")}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className="size-[1.05rem]"
                                />
                            </span>

                            <span className="min-w-0 flex-1">
                                {item.label}
                            </span>

                            {isActive && (
                                <span
                                    aria-hidden="true"
                                    className="size-1.5 rounded-full bg-brand"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );

    const workspaceSummary = (
        <div className="mt-7 rounded-2xl border border-border bg-surface-subtle p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-brand">
                    RESTNEST workspace
                </p>

                <span
                    className={[
                        "rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.08em]",
                        roleBadgeClasses[user.role],
                    ].join(" ")}
                >
                    {roleLabels[user.role]}
                </span>
            </div>

            <p className="mt-3 text-sm font-bold text-foreground">
                {roleLabels[user.role]} dashboard
            </p>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                {roleDescriptions[user.role]}
            </p>
        </div>
    );

    const accountPanel = (
        <div className="mt-auto border-t border-border pt-5">
            <div className="flex items-center gap-3 rounded-2xl bg-surface-subtle p-3">
                <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-sm font-bold text-brand-foreground"
                >
                    {getUserInitial(user.name)}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                        {user.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <div className="flex min-h-11 min-w-0 flex-1 items-center justify-between rounded-xl border border-border bg-background pl-3 pr-1">
                    <span className="truncate text-xs font-semibold text-muted-foreground">
                        Theme
                    </span>

                    <ThemeToggle />
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-label={
                        isLoggingOut
                            ? "Signing out"
                            : "Sign out"
                    }
                    title={
                        isLoggingOut
                            ? "Signing out"
                            : "Sign out"
                    }
                    className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors duration-200 hover:border-danger/35 hover:bg-danger-soft hover:text-danger disabled:cursor-wait disabled:opacity-60"
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
                {workspaceSummary}
                {navigation}
                {accountPanel}
            </aside>

            <div className="min-w-0 lg:pl-72">
                <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur-md sm:px-6 lg:hidden">
                    <SiteLogo />

                    <div className="flex shrink-0 items-center gap-2">
                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={() =>
                                setIsSidebarOpen(true)
                            }
                            aria-label="Open dashboard navigation"
                            aria-expanded={isSidebarOpen}
                            aria-controls="dashboard-mobile-sidebar"
                            className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                        >
                            <Menu
                                aria-hidden="true"
                                className="size-5"
                            />
                        </button>
                    </div>
                </header>

                <div className="hidden min-h-16 items-center justify-between gap-6 border-b border-border bg-surface-subtle px-8 lg:flex">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            {roleLabels[user.role]} workspace
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-foreground">
                            {activeNavigationItem.label}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserRound
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />

                        <span className="max-w-64 truncate">
                            Signed in as{" "}
                            <strong className="font-bold text-foreground">
                                {user.name}
                            </strong>
                        </span>
                    </div>
                </div>

                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <button
                            type="button"
                            aria-label="Close dashboard navigation"
                            onClick={closeSidebar}
                            className="absolute inset-0 bg-overlay backdrop-blur-sm"
                        />

                        <aside
                            id="dashboard-mobile-sidebar"
                            aria-label="Mobile dashboard sidebar"
                            className="absolute inset-y-0 left-0 flex w-[min(20rem,calc(100vw-1rem))] flex-col overflow-y-auto border-r border-border bg-surface p-5 shadow-raised"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <SiteLogo />

                                <button
                                    type="button"
                                    onClick={closeSidebar}
                                    aria-label="Close dashboard navigation"
                                    className="grid size-10 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                                >
                                    <X
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </button>
                            </div>

                            {workspaceSummary}
                            {navigation}
                            {accountPanel}
                        </aside>
                    </div>
                )}

                <main
                    id="dashboard-main-content"
                    className="mx-auto w-full max-w-[92rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}