import type { Metadata } from "next";
import {
    Building2,
    KeyRound,
    ShieldCheck,
} from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Login",
    description:
        "Sign in to your RESTNEST tenant, landlord, or admin account.",
};

const accountFeatures = [
    {
        title: "Tenant access",
        description:
            "Track rental requests, payments, and review eligibility.",
        icon: KeyRound,
    },
    {
        title: "Landlord access",
        description:
            "Manage property listings and incoming rental requests.",
        icon: Building2,
    },
    {
        title: "Protected sessions",
        description:
            "Authentication tokens remain inside secure HTTP-only cookies.",
        icon: ShieldCheck,
    },
] as const;

export default function LoginPage() {
    return (
        <main className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[88rem] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.72fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-9 lg:px-8 lg:py-20">
            <section className="lg:col-start-1 lg:row-start-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Your RESTNEST account
                </p>

                <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    Everything you need, based on your role.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                    Sign in once and RESTNEST will direct you to the correct tenant,
                    landlord, or administrative workspace.
                </p>
            </section>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
                <LoginForm />
            </div>

            <section
                aria-label="Account features"
                className="grid gap-4 lg:col-start-1 lg:row-start-2"
            >
                {accountFeatures.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <article
                            key={feature.title}
                            className="flex gap-4 rounded-2xl border border-border bg-surface p-5"
                        >
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                                <Icon aria-hidden="true" className="size-5" />
                            </span>

                            <div>
                                <h2 className="font-semibold text-foreground">
                                    {feature.title}
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}