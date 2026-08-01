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
            "Browse properties, monitor rental requests, complete approved payments, and submit reviews from one focused workspace.",
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
                    "Review payment activity connected to your rental requests.",
                icon: CreditCard,
            },
            {
                title: "Property reviews",
                description:
                    "Leave feedback after completing an eligible rental experience.",
                icon: Star,
            },
        ],
    },
    LANDLORD: {
        eyebrow: "Landlord workspace",
        title: "Manage properties without unnecessary clutter.",
        description:
            "Create listings, manage availability, review incoming requests, and monitor rental activity from one organized dashboard.",
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
                    "Review incoming tenant requests and approve or reject them.",
                icon: ClipboardList,
            },
            {
                title: "Payment activity",
                description:
                    "Monitor payment information connected to your rental properties.",
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
                    "Inspect platform users and manage active or banned accounts.",
                icon: UsersRound,
            },
            {
                title: "Property inspection",
                description:
                    "Review property listings published across the marketplace.",
                icon: House,
            },
            {
                title: "Rental oversight",
                description:
                    "Inspect rental requests and monitor overall platform activity.",
                icon: ShieldCheck,
            },
        ],
    },
} as const;

const roleVisualStyles: Record<
    UserRole,
    Readonly<{
        eyebrow: string;
        icon: string;
        decoration: string;
    }>
> = {
    TENANT: {
        eyebrow: "border-info/20 bg-info-soft text-info",
        icon: "bg-info-soft text-info",
        decoration: "bg-info-soft",
    },
    LANDLORD: {
        eyebrow:
            "border-accent/20 bg-accent-soft text-accent",
        icon: "bg-accent-soft text-accent",
        decoration: "bg-accent-soft",
    },
    ADMIN: {
        eyebrow:
            "border-warning/20 bg-warning-soft text-warning",
        icon: "bg-warning-soft text-warning",
        decoration: "bg-warning-soft",
    },
};

type RoleOverviewProps = Readonly<{
    role: UserRole;
}>;

export function RoleOverview({
    role,
}: RoleOverviewProps) {
    const content = overviewContent[role];
    const visualStyle = roleVisualStyles[role];
    const titleId = `${role.toLowerCase()}-role-overview-title`;

    return (
        <section aria-labelledby={titleId}>
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className={`absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] ${visualStyle.decoration} lg:block`}
                />

                <div className="relative max-w-4xl">
                    <span
                        className={`inline-flex rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] ${visualStyle.eyebrow}`}
                    >
                        {content.eyebrow}
                    </span>

                    <h1
                        id={titleId}
                        className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                    >
                        {content.title}
                    </h1>

                    <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        {content.description}
                    </p>

                    <Link
                        href={content.actionHref}
                        className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                    >
                        {content.actionLabel}

                        <ArrowRight
                            aria-hidden="true"
                            className="size-4"
                        />
                    </Link>
                </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {content.cards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.title}
                            className="group rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/25 hover:shadow-raised sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span
                                    className={`grid size-12 shrink-0 place-items-center rounded-2xl ${visualStyle.icon}`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>

                                <span className="text-xs font-bold tracking-[0.12em] text-muted-foreground">
                                    0{index + 1}
                                </span>
                            </div>

                            <h2 className="mt-5 text-lg font-bold tracking-[-0.025em] text-foreground transition-colors duration-200 group-hover:text-brand">
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