"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AuthActions } from "@/components/layout/auth-actions";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Properties",
        href: "/properties",
    },
] as const;

function isActiveRoute(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname.startsWith(href);
}

function getDesktopLinkClass(isActive: boolean) {
    return [
        "rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200",
        isActive
            ? "bg-brand-soft text-brand"
            : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
    ].join(" ");
}

function getMobileLinkClass(isActive: boolean) {
    return [
        "flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200",
        isActive
            ? "bg-brand-soft text-brand"
            : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
    ].join(" ");
}

export function SiteHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function toggleMenu() {
        setIsMenuOpen((currentState) => !currentState);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
            <div className="mx-auto flex min-h-19 w-full max-w-352 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <SiteLogo />

                <nav
                    aria-label="Primary navigation"
                    className="hidden items-center gap-1 rounded-2xl border border-border bg-surface-subtle p-1 lg:flex"
                >
                    {navigationItems.map((item) => {
                        const isActive = isActiveRoute(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={getDesktopLinkClass(isActive)}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <ThemeToggle />
                    <AuthActions variant="desktop" />
                </div>

                <div className="flex shrink-0 items-center gap-2 lg:hidden">
                    <ThemeToggle />

                    <button
                        type="button"
                        aria-label={
                            isMenuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={toggleMenu}
                        className="grid size-11 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                    >
                        {isMenuOpen ? (
                            <X aria-hidden="true" className="size-5" />
                        ) : (
                            <Menu aria-hidden="true" className="size-5" />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-border bg-surface-subtle px-4 py-4 sm:px-6 lg:hidden"
                >
                    <div className="mx-auto max-w-352 rounded-2xl border border-border bg-surface p-2 shadow-soft">
                        <nav
                            aria-label="Mobile navigation"
                            className="flex flex-col gap-1"
                        >
                            {navigationItems.map((item) => {
                                const isActive = isActiveRoute(
                                    pathname,
                                    item.href,
                                );

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMenu}
                                        aria-current={isActive ? "page" : undefined}
                                        className={getMobileLinkClass(isActive)}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-2 border-t border-border px-2 pt-4">
                            <AuthActions
                                variant="mobile"
                                onNavigate={closeMenu}
                            />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}