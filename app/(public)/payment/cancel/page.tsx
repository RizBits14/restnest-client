import {
    ArrowLeft,
    CreditCard,
    Search,
    XCircle,
} from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <main className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
            <section className="w-full rounded-[2rem] border border-border bg-surface p-6 text-center shadow-[0_24px_70px_rgba(25,35,29,0.08)] sm:p-10">
                <span className="mx-auto grid size-20 place-items-center rounded-[1.75rem] border border-amber-700/20 bg-amber-100 text-amber-900 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-200">
                    <XCircle
                        aria-hidden="true"
                        className="size-9"
                    />
                </span>

                <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Stripe checkout cancelled
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    Payment was not completed
                </h1>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-muted-foreground">
                    You left Stripe Checkout before completing
                    the payment. Your approved rental request
                    remains available, so you can try again from
                    your tenant dashboard.
                </p>

                <div className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm text-muted-foreground">
                    <CreditCard
                        aria-hidden="true"
                        className="size-4 text-brand"
                    />
                    No successful payment confirmation was
                    received.
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Link
                        href="/dashboard/tenant/rentals"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        <ArrowLeft
                            aria-hidden="true"
                            className="size-4"
                        />
                        Return to my rentals
                    </Link>

                    <Link
                        href="/properties"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        Browse properties
                        <Search
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                    </Link>
                </div>
            </section>
        </main>
    );
}