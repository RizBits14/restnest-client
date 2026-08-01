import type { Metadata } from "next";
import {
    ArrowLeft,
    CreditCard,
    Info,
    RefreshCw,
    Search,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Payment Cancelled",
    description:
        "Your Stripe checkout was cancelled. Return to your RESTNEST tenant dashboard when you are ready to try again.",
};

const cancellationNotes = [
    {
        title: "No payment completed",
        description:
            "RESTNEST did not receive a successful Stripe payment confirmation.",
        icon: CreditCard,
    },
    {
        title: "Request remains approved",
        description:
            "Your approved rental request remains available unless its status changes.",
        icon: ShieldCheck,
    },
    {
        title: "Try again later",
        description:
            "Return to your tenant rentals and restart checkout whenever you are ready.",
        icon: RefreshCw,
    },
] as const;

export default function PaymentCancelPage() {
    return (
        <section
            aria-labelledby="payment-cancel-title"
            className="relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20"
        >
            <div
                aria-hidden="true"
                className="absolute left-0 top-28 hidden h-56 w-14 rounded-r-[2.5rem] bg-warning-soft xl:block"
            />

            <div
                aria-hidden="true"
                className="absolute bottom-20 right-0 hidden h-44 w-14 rounded-l-[2.5rem] bg-accent-soft xl:block"
            />

            <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised">
                    <div className="border-b border-border bg-surface-subtle px-6 py-8 text-center sm:px-10 sm:py-10">
                        <span className="mx-auto grid size-20 place-items-center rounded-[1.6rem] bg-warning-soft text-warning">
                            <XCircle
                                aria-hidden="true"
                                className="size-9"
                                strokeWidth={1.8}
                            />
                        </span>

                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-warning">
                            Stripe checkout cancelled
                        </p>

                        <h1
                            id="payment-cancel-title"
                            className="mt-3 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Payment was not completed
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                            You left Stripe Checkout before completing the
                            payment. Your approved rental request remains
                            available, so you can return and try again later.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="grid gap-3 md:grid-cols-3">
                            {cancellationNotes.map((note, index) => {
                                const Icon = note.icon;

                                return (
                                    <article
                                        key={note.title}
                                        className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-[1.1rem]"
                                                />
                                            </span>

                                            <span className="text-xs font-bold tracking-[0.12em] text-muted-foreground">
                                                0{index + 1}
                                            </span>
                                        </div>

                                        <h2 className="mt-4 text-sm font-bold text-foreground">
                                            {note.title}
                                        </h2>

                                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                            {note.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>

                        <div
                            role="status"
                            className="mt-6 flex items-start gap-3 rounded-2xl border border-info/20 bg-info-soft px-5 py-5"
                        >
                            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-info text-info-foreground">
                                <Info
                                    aria-hidden="true"
                                    className="size-5"
                                />
                            </span>

                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    Nothing has been charged
                                </p>

                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    No successful payment confirmation was
                                    received. Open your tenant dashboard to
                                    review the request before restarting payment.
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/dashboard/tenant/rentals"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                            >
                                <ArrowLeft
                                    aria-hidden="true"
                                    className="size-4"
                                />

                                Return to my rentals
                            </Link>

                            <Link
                                href="/properties"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                            >
                                Browse properties

                                <Search
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
                            Cancelling checkout does not cancel the approved
                            rental request itself.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}