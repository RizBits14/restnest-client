import type { Metadata } from "next";
import {
    Building2,
    CheckCircle2,
    KeyRound,
    ShieldCheck,
} from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Log In",
    description:
        "Sign in to your RESTNEST tenant, landlord, or admin account.",
};

const accountFeatures = [
    {
        title: "Tenant workspace",
        description:
            "Track rental requests, approved payments, and review eligibility.",
        icon: KeyRound,
    },
    {
        title: "Landlord workspace",
        description:
            "Manage property listings and respond to incoming rental requests.",
        icon: Building2,
    },
    {
        title: "Protected account access",
        description:
            "Your authenticated session stays protected through secure HTTP-only cookies.",
        icon: ShieldCheck,
    },
] as const;

const accessHighlights = [
    "One account for your assigned role",
    "Automatic role-based dashboard routing",
    "Secure access to protected actions",
] as const;

export default function LoginPage() {
    return (
        <section
            aria-labelledby="login-page-title"
            className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20"
        >
            <div
                aria-hidden="true"
                className="absolute right-0 top-24 hidden h-64 w-16 rounded-l-[2.5rem] bg-accent-soft/70 xl:block"
            />

            <div className="relative mx-auto grid w-full max-w-[88rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(25rem,0.78fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 xl:gap-20">
                <div className="mx-auto w-full max-w-[30rem] lg:mx-0 lg:mr-auto">
                    <LoginForm />
                </div>

                <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full bg-accent"
                        />
                        Welcome back
                    </div>

                    <h1
                        id="login-page-title"
                        className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.75rem]"
                    >
                        Your RESTNEST workspace,
                        <span className="block text-brand">
                            ready when you are.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        Sign in once and RESTNEST will direct you to the
                        correct tenant, landlord, or administrative
                        dashboard.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {accountFeatures.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
                                >
                                    <span className="grid size-10 place-items-center rounded-xl bg-surface-muted text-brand">
                                        <Icon
                                            aria-hidden="true"
                                            className="size-[1.1rem]"
                                        />
                                    </span>

                                    <h2 className="mt-4 text-sm font-bold text-foreground">
                                        {feature.title}
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mt-6 rounded-2xl border border-success/20 bg-success-soft p-5">
                        <p className="text-sm font-bold text-foreground">
                            What happens after you sign in
                        </p>

                        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                            {accessHighlights.map((highlight) => (
                                <li
                                    key={highlight}
                                    className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                                >
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="mt-1 size-4 shrink-0 text-success"
                                    />

                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}