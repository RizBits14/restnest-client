import {
    ArrowRight,
    Building2,
    KeyRound,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
    ImageAccordion,
    type ImageAccordionItem,
} from "@/components/ui/image-accordion";
import { SolidTextReveal } from "@/components/ui/solid-text-reveal";

const propertyShowcase: readonly ImageAccordionItem[] = [
    {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
        alt: "Modern family house with a landscaped front yard",
        title: "Family homes",
        description:
            "Comfortable spaces for everyday living, with room to settle in and grow.",
        label: "Spacious",
    },
    {
        src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        alt: "Warm and modern apartment living room",
        title: "City apartments",
        description:
            "Well-connected rentals designed for convenient urban living.",
        label: "Connected",
    },
    {
        src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80",
        alt: "Bright minimalist studio apartment interior",
        title: "Modern studios",
        description:
            "Efficient, welcoming spaces suited to independent lifestyles.",
        label: "Minimal",
    },
    {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
        alt: "Premium home interior with warm natural materials",
        title: "Premium stays",
        description:
            "Refined homes with thoughtful details and a more elevated finish.",
        label: "Refined",
    },
];

const serviceHighlights = [
    {
        title: "Clear listings",
        description:
            "Compare property details, prices, and locations with confidence.",
        icon: Building2,
    },
    {
        title: "Simple requests",
        description:
            "Submit and track every rental request from one dashboard.",
        icon: KeyRound,
    },
    {
        title: "Secure checkout",
        description:
            "Complete approved payments safely through Stripe Checkout.",
        icon: ShieldCheck,
    },
] as const;

export function HeroSection() {
    return (
        <section
            aria-labelledby="home-hero-title"
            className="relative overflow-hidden border-b border-border bg-background"
        >
            <div
                aria-hidden="true"
                className="absolute left-0 top-24 hidden h-64 w-16 rounded-r-[2.5rem] bg-accent-soft/70 xl:block"
            />

            <div
                aria-hidden="true"
                className="absolute bottom-16 right-0 hidden h-44 w-14 rounded-l-[2.5rem] bg-brand-soft/80 xl:block"
            />

            <div className="relative mx-auto grid min-h-[calc(100svh-4.75rem)] w-full max-w-[88rem] items-center gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.92fr)] lg:gap-16 lg:px-8 lg:py-24 xl:gap-20">
                <div className="max-w-3xl">

                    <SolidTextReveal
                        as="h1"
                        id="home-hero-title"
                        lines={[
                            "Find a home",
                            "that feels right,",
                            "without the complexity.",
                        ]}
                        accentLineIndex={2}
                        revealTone="accent"
                        delayStepMs={130}
                        className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl sm:leading-[1.04] lg:text-[4.15rem] lg:leading-[1.01]"
                    />

                    <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        RESTNEST brings property discovery, rental requests,
                        secure payments, and role-based management into one
                        clear and welcoming experience.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/properties"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground shadow-soft transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            Explore properties

                            <ArrowRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </Link>

                        <Link
                            href="/auth/register"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-sm font-bold text-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted"
                        >
                            List your property

                            <Building2
                                aria-hidden="true"
                                className="size-4 text-accent"
                            />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                        {serviceHighlights.map((highlight) => {
                            const Icon = highlight.icon;

                            return (
                                <article
                                    key={highlight.title}
                                    className="rounded-2xl border border-border bg-surface/80 p-4"
                                >
                                    <span className="grid size-10 place-items-center rounded-xl bg-surface-muted text-brand">
                                        <Icon
                                            aria-hidden="true"
                                            className="size-[1.1rem]"
                                        />
                                    </span>

                                    <h2 className="mt-4 text-sm font-bold text-foreground">
                                        {highlight.title}
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                        {highlight.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-2xl ">
                    <div
                        aria-hidden="true"
                        className="absolute -left-5 top-12 hidden size-24 rounded-[2rem] border border-accent/20 bg-accent-soft lg:block"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute -bottom-5 -right-5 hidden size-32 rounded-full border border-brand/20 bg-brand-soft lg:block"
                    />

                    <div className="relative">
                        <ImageAccordion
                            items={propertyShowcase}
                            defaultActiveIndex={1}
                            ariaLabel="RESTNEST property showcase"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}