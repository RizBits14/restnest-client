import {
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { SiteLogo } from "@/components/layout/site-logo";

const footerGroups = [
    {
        title: "Explore",
        links: [
            {
                label: "Home",
                href: "/",
            },
            {
                label: "Browse properties",
                href: "/properties",
            },
        ],
    },
    {
        title: "Account",
        links: [
            {
                label: "Sign in",
                href: "/auth/login",
            },
            {
                label: "Create account",
                href: "/auth/register",
            },
        ],
    },
    {
        title: "Workspaces",
        links: [
            {
                label: "Tenant dashboard",
                href: "/dashboard/tenant",
            },
            {
                label: "Landlord dashboard",
                href: "/dashboard/landlord",
            },
        ],
    },
] as const;

export function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            aria-labelledby="site-footer-heading"
            className="border-t border-border bg-surface"
        >
            <h2
                id="site-footer-heading"
                className="sr-only"
            >
                RESTNEST footer
            </h2>

            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
                    <div className="max-w-lg">
                        <SiteLogo />

                        <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                            A connected rental marketplace for discovering
                            properties, managing requests, completing
                            secure payments, and supporting every role
                            through a clear digital experience.
                        </p>


                        <Link
                            href="/properties"
                            className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            Explore the marketplace

                            <ArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        {footerGroups.map((group) => (
                            <nav
                                key={group.title}
                                aria-label={`${group.title} footer navigation`}
                            >
                                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                                    {group.title}
                                </h3>

                                <ul className="mt-5 space-y-3.5">
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-brand"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {currentYear} RESTNEST. All rights reserved.
                    </p>

                    <p>
                        Clear property discovery and rental management.
                    </p>
                </div>
            </div>
        </footer>
    );
}