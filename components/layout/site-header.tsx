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

function isActiveRoute(
    pathname: string,
    href: string,
) {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname.startsWith(href);
}

export function SiteHeader() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] =
        useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-8">
                <SiteLogo />

                <nav
                    aria-label="Primary navigation"
                    className="hidden items-center gap-1 lg:flex"
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
                                aria-current={
                                    isActive ? "page" : undefined
                                }
                                className={
                                    isActive
                                        ? "rounded-xl bg-surface-muted px-4 py-2 text-sm font-medium text-foreground"
                                        : "rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-foreground"
                                }
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

                <div className="flex items-center gap-2 lg:hidden">
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
                        onClick={() =>
                            setIsMenuOpen(
                                (currentState) => !currentState,
                            )
                        }
                        className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted"
                    >
                        {isMenuOpen ? (
                            <X
                                aria-hidden="true"
                                className="size-5"
                            />
                        ) : (
                            <Menu
                                aria-hidden="true"
                                className="size-5"
                            />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-border bg-background px-4 py-4 lg:hidden"
                >
                    <nav
                        aria-label="Mobile navigation"
                        className="mx-auto flex max-w-[88rem] flex-col gap-1"
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
                                    aria-current={
                                        isActive ? "page" : undefined
                                    }
                                    className={
                                        isActive
                                            ? "rounded-xl bg-surface-muted px-4 py-3 text-sm font-medium text-foreground"
                                            : "rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-foreground"
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mx-auto mt-4 max-w-[88rem] border-t border-border pt-4">
                        <AuthActions
                            variant="mobile"
                            onNavigate={closeMenu}
                        />
                    </div>
                </div>
            )}
        </header>
    );
}