import {
    ArrowRight,
    Building2,
    CheckCircle2,
    Search,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type ExperienceTone =
    | "brand"
    | "accent"
    | "warning";

type ExperienceItem = Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    features: readonly string[];
    href: string;
    linkLabel: string;
    icon: LucideIcon;
    tone: ExperienceTone;
}>;

const toneStyles: Record<
    ExperienceTone,
    Readonly<{
        icon: string;
        eyebrow: string;
        featureIcon: string;
    }>
> = {
    brand: {
        icon: "bg-brand-soft text-brand",
        eyebrow: "text-brand",
        featureIcon: "text-brand",
    },
    accent: {
        icon: "bg-accent-soft text-accent",
        eyebrow: "text-accent",
        featureIcon: "text-accent",
    },
    warning: {
        icon: "bg-warning-soft text-warning",
        eyebrow: "text-warning",
        featureIcon: "text-warning",
    },
};

const experiences: readonly ExperienceItem[] = [
    {
        eyebrow: "For tenants",
        title: "Discover and rent with confidence.",
        description:
            "Explore clear property information, send rental requests, monitor decisions, complete payments, and share your experience.",
        features: [
            "Search available properties",
            "Track rental-request progress",
            "Pay and review securely",
        ],
        href: "/properties",
        linkLabel: "Explore properties",
        icon: Search,
        tone: "brand",
    },
    {
        eyebrow: "For landlords",
        title: "Manage every listing in one place.",
        description:
            "Publish properties, keep availability accurate, review tenant requests, and manage the complete rental lifecycle.",
        features: [
            "Create and edit listings",
            "Review tenant requests",
            "Monitor property activity",
        ],
        href: "/auth/register",
        linkLabel: "Create landlord account",
        icon: Building2,
        tone: "accent",
    },
    {
        eyebrow: "For administrators",
        title: "Maintain a trusted marketplace.",
        description:
            "Monitor users and listings, manage account access, and inspect marketplace activity from a focused workspace.",
        features: [
            "Review platform accounts",
            "Manage access status",
            "Inspect marketplace listings",
        ],
        href: "/auth/login",
        linkLabel: "Administrator sign in",
        icon: ShieldCheck,
        tone: "warning",
    },
];

export function PlatformExperienceSection() {
    return (
        <section
            aria-labelledby="platform-experience-title"
            className="border-b border-border bg-surface-subtle py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            Designed around real workflows
                        </span>

                        <h2
                            id="platform-experience-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            One connected platform.
                            <span className="block text-brand">
                                Three focused experiences.
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-xl text-base leading-7 text-muted-foreground">
                        RESTNEST gives tenants, landlords, and
                        administrators the tools relevant to their
                        responsibilities without unnecessary complexity.
                    </p>
                </div>

                <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
                    {experiences.map((experience) => {
                        const Icon = experience.icon;
                        const visualStyle =
                            toneStyles[experience.tone];

                        return (
                            <article
                                key={experience.eyebrow}
                                className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-brand/25 hover:shadow-raised sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <span
                                        className={`grid size-14 shrink-0 place-items-center rounded-2xl ${visualStyle.icon}`}
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className="size-6"
                                            strokeWidth={1.8}
                                        />
                                    </span>

                                    <span
                                        className={`text-xs font-bold uppercase tracking-[0.13em] ${visualStyle.eyebrow}`}
                                    >
                                        {experience.eyebrow}
                                    </span>
                                </div>

                                <h3 className="mt-7 text-2xl font-bold leading-tight tracking-[-0.035em] text-foreground">
                                    {experience.title}
                                </h3>

                                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                    {experience.description}
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {experience.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-3 text-sm font-semibold text-foreground"
                                        >
                                            <CheckCircle2
                                                aria-hidden="true"
                                                className={`mt-0.5 size-4 shrink-0 ${visualStyle.featureIcon}`}
                                            />

                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-8">
                                    <Link
                                        href={experience.href}
                                        className="group/link inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                                    >
                                        {experience.linkLabel}

                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5"
                                        />
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-brand px-6 py-8 text-brand-foreground sm:px-8 sm:py-10 lg:px-10">
                    <div
                        aria-hidden="true"
                        className="absolute right-0 top-0 hidden h-full w-28 rounded-l-[3rem] bg-brand-foreground/10 lg:block"
                    />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-foreground/75">
                                Start your RESTNEST journey
                            </p>

                            <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                                Find a home or introduce your property to
                                the marketplace.
                            </h3>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-brand-foreground/80">
                                Begin with property discovery or create an
                                account to access the tools designed for
                                your role.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                            <Link
                                href="/properties"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-foreground transition-transform duration-200 hover:-translate-y-0.5"
                            >
                                Browse properties

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/auth/register"
                                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-foreground/25 px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-foreground/10"
                            >
                                Create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}