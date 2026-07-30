import {
    ArrowRight,
    Building2,
    CircleCheck,
    KeyRound,
    MapPin,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const journeySteps = [
    {
        number: "01",
        title: "Discover",
        description: "Explore properties with clear pricing and useful details.",
        icon: MapPin,
    },
    {
        number: "02",
        title: "Request",
        description: "Send a rental request and follow every status update.",
        icon: KeyRound,
    },
    {
        number: "03",
        title: "Pay securely",
        description: "Complete payment through a protected Stripe checkout.",
        icon: ShieldCheck,
    },
] as const;

export function HeroSection() {
    return (
        <section className="overflow-hidden border-b border-border">
            <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[88rem] items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-20 lg:px-8 lg:py-24">
                <div>
                    <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl">
                        Find a place that feels right.
                        <span className="block text-brand">
                            Manage it without the noise.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        RESTNEST brings property discovery, rental requests, secure
                        payments, and role-based management into one calm and connected
                        experience.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/properties"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-brand-foreground transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            Explore properties
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>

                        <Link
                            href="/auth/register"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                        >
                            List your property
                        </Link>
                    </div>

                    <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-border bg-surface p-4">
                            <Building2
                                aria-hidden="true"
                                className="mb-3 size-5 text-brand"
                            />
                            <p className="text-sm font-semibold text-foreground">
                                Property discovery
                            </p>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                Search and compare listings.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-4">
                            <KeyRound
                                aria-hidden="true"
                                className="mb-3 size-5 text-brand"
                            />
                            <p className="text-sm font-semibold text-foreground">
                                Rental management
                            </p>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                Track every request clearly.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-4">
                            <ShieldCheck
                                aria-hidden="true"
                                className="mb-3 size-5 text-brand"
                            />
                            <p className="text-sm font-semibold text-foreground">
                                Secure checkout
                            </p>
                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                Complete payments with Stripe.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-xl">
                    <div
                        aria-hidden="true"
                        className="absolute -left-5 top-16 hidden size-24 rounded-[2rem] border border-brand/30 bg-brand/10 lg:block"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute -right-5 bottom-14 hidden size-32 rounded-full border border-border bg-surface-muted lg:block"
                    />

                    <div className="relative rounded-[2rem] border border-border bg-surface p-5 shadow-[0_24px_80px_rgba(26,35,29,0.12)] sm:p-7">
                        <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                                    RESTNEST Journey
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-foreground">
                                    A clearer path from search to settlement.
                                </h2>
                            </div>

                            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground">
                                <Building2 aria-hidden="true" className="size-5" />
                            </span>
                        </div>

                        <div className="divide-y divide-border">
                            {journeySteps.map((step) => {
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.number}
                                        className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5"
                                    >
                                        <span className="min-w-12 text-3xl font-semibold leading-none tracking-[-0.05em] tabular-nums text-brand">
                                            {step.number}
                                        </span>

                                        <div>
                                            <p className="text-base font-semibold text-foreground">
                                                {step.title}
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>

                                        <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-muted text-brand">
                                            <Icon aria-hidden="true" className="size-[1.1rem]" />
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl bg-surface-muted p-4">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground">
                                    <CircleCheck aria-hidden="true" className="size-4" />
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Status stays visible
                                    </p>
                                </div>
                            </div>

                            <span className="hidden rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-brand sm:inline-flex">
                                Built for clarity
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}