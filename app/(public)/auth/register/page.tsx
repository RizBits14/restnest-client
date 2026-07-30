import type { Metadata } from "next";
import {
    BadgeCheck,
    Building2,
    SearchCheck,
} from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Create Account",
    description:
        "Create a RESTNEST tenant or landlord account.",
};

const registrationFeatures = [
    {
        title: "Role-based experience",
        description:
            "Your navigation and dashboard adapt to how you use RESTNEST.",
        icon: BadgeCheck,
    },
    {
        title: "Tenant tools",
        description:
            "Discover properties, request rentals, pay, and leave reviews.",
        icon: SearchCheck,
    },
    {
        title: "Landlord tools",
        description:
            "Publish listings, manage availability, and review requests.",
        icon: Building2,
    },
] as const;

export default function RegisterPage() {
    return (
        <main className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[88rem] items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(500px,0.9fr)] lg:gap-x-12 lg:px-8 lg:py-20">
            <div className="contents lg:col-start-1 lg:block">
                <section className="order-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                        Start your RESTNEST journey
                    </p>

                    <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                        One account, built around your rental role.
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Register as a tenant or landlord and RESTNEST will provide the
                        tools that match your responsibilities.
                    </p>
                </section>

                <section
                    aria-label="Registration benefits"
                    className="order-3 grid gap-4 lg:mt-9"
                >
                    {registrationFeatures.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <article
                                key={feature.title}
                                className="flex gap-4 rounded-2xl border border-border bg-surface p-5"
                            >
                                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                                    <Icon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
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
            </div>

            <div className="order-2 lg:col-start-2 lg:row-start-1">
                <RegisterForm />
            </div>
        </main>
    );
}