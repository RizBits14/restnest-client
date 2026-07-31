import {
    ArrowRight,
    Building2,
    ClipboardList,
    CreditCard,
    House,
    ShieldCheck,
    Star,
    UsersRound,
} from "lucide-react";
import Link from "next/link";

import type { UserRole } from "@/types/auth";

const overviewContent = {
    TENANT: {
        eyebrow: "Tenant workspace",
        title: "Your rental journey, clearly organized.",
        description:
            "Browse properties, monitor rental requests, complete payments, and submit reviews from one focused workspace.",
        actionLabel: "Browse properties",
        actionHref: "/properties",
        cards: [
            {
                title: "Rental requests",
                description:
                    "Follow pending, approved, rejected, active, and completed requests.",
                icon: ClipboardList,
            },
            {
                title: "Payment history",
                description:
                    "Review completed and pending rental payments.",
                icon: CreditCard,
            },
            {
                title: "Property reviews",
                description:
                    "Leave feedback after a successful rental payment.",
                icon: Star,
            },
        ],
    },

    LANDLORD: {
        eyebrow: "Landlord workspace",
        title: "Manage properties without the clutter.",
        description:
            "Create listings, manage availability, review incoming requests, and monitor your rental activity.",
        actionLabel: "Browse marketplace",
        actionHref: "/properties",
        cards: [
            {
                title: "Property management",
                description:
                    "Create, edit, remove, and update the availability of your listings.",
                icon: Building2,
            },
            {
                title: "Rental requests",
                description:
                    "Review tenant requests and approve or reject them.",
                icon: ClipboardList,
            },
            {
                title: "Payment activity",
                description:
                    "Monitor payments connected to your rental properties.",
                icon: CreditCard,
            },
        ],
    },

    ADMIN: {
        eyebrow: "Administrative workspace",
        title: "Keep the marketplace healthy and accountable.",
        description:
            "Monitor users, properties, and rental activity across the entire RESTNEST platform.",
        actionLabel: "View marketplace",
        actionHref: "/properties",
        cards: [
            {
                title: "User management",
                description:
                    "Inspect platform users and manage banned or active accounts.",
                icon: UsersRound,
            },
            {
                title: "Property inspection",
                description:
                    "Review all property listings across the marketplace.",
                icon: House,
            },
            {
                title: "Rental oversight",
                description:
                    "Inspect rental requests and monitor platform activity.",
                icon: ShieldCheck,
            },
        ],
    },
} as const;

type RoleOverviewProps = Readonly<{
    role: UserRole;
}>;

export function RoleOverview({
    role,
}: RoleOverviewProps) {
    const content = overviewContent[role];

    return (
        <section>
            <div className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    {content.eyebrow}
                </p>

                <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    {content.title}
                </h1>

                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                    {content.description}
                </p>

                <Link
                    href={content.actionHref}
                    className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-transform duration-200 hover:-translate-y-0.5"
                >
                    {content.actionLabel}
                    <ArrowRight
                        aria-hidden="true"
                        className="size-4"
                    />
                </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {content.cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.title}
                            className="rounded-[1.75rem] border border-border bg-surface p-6"
                        >
                            <span className="grid size-12 place-items-center rounded-2xl bg-surface-muted text-brand">
                                <Icon
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <h2 className="mt-5 text-lg font-semibold text-foreground">
                                {card.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {card.description}
                            </p>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}