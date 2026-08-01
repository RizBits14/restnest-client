import type { Metadata } from "next";
import {
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Create Account",
    description:
        "Create a RESTNEST tenant or landlord account and access role-specific rental tools.",
};

const registrationHighlights = [
    "Choose a tenant or landlord account",
    "Access protected role-specific tools",
    "Manage your rental journey in one place",
] as const;

export default function RegisterPage() {
    return (
        <section
            aria-labelledby="registration-information-title"
            className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20"
        >
            <div
                aria-hidden="true"
                className="absolute right-0 top-32 hidden h-64 w-16 rounded-l-[2.5rem] bg-brand-soft/75 xl:block"
            />

            <div className="relative mx-auto grid w-full max-w-[88rem] items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(32rem,0.92fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 xl:gap-20">
                <div className="mx-auto w-full max-w-[38rem] lg:mx-0 lg:mr-auto">
                    <RegisterForm />
                </div>

                <div className="min-w-0 lg:sticky lg:top-28">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full bg-accent"
                        />
                        Start your journey
                    </div>

                    <h2
                        id="registration-information-title"
                        className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.5rem]"
                    >
                        One account, designed around
                        <span className="block text-brand">
                            your rental role.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        Register as a tenant or landlord and RESTNEST will
                        provide the navigation, dashboard, and tools that
                        match your responsibilities.
                    </p>

                    <div className="mt-6 rounded-2xl border border-success/20 bg-success-soft p-5">
                        <div className="flex items-start gap-3">
                            <ShieldCheck
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-success"
                            />

                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    What your account includes
                                </p>

                                <ul className="mt-3 grid gap-2">
                                    {registrationHighlights.map(
                                        (highlight) => (
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
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}