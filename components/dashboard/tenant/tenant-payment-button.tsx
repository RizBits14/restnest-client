"use client";

import { useMutation } from "@tanstack/react-query";
import {
    ArrowUpRight,
    CreditCard,
    LoaderCircle,
    ShieldCheck,
} from "lucide-react";

import { toaster } from "@/components/ui/app-toaster";
import { createTenantPayment } from "@/lib/api/tenant-payments-client";
import type { RentalPayment } from "@/types/rental";

type TenantPaymentButtonProps = Readonly<{
    rentalRequestId: string;
    propertyTitle: string;
    payment: RentalPayment | null;
}>;

export function TenantPaymentButton({
    rentalRequestId,
    propertyTitle,
    payment,
}: TenantPaymentButtonProps) {
    const paymentMutation = useMutation({
        mutationFn: () =>
            createTenantPayment({
                rentalRequestId,
            }),

        onSuccess: (createdPayment) => {
            window.location.assign(
                createdPayment.paymentUrl!,
            );
        },

        onError: (error) => {
            toaster.error({
                title: "Payment could not be started",
                description:
                    error instanceof Error
                        ? error.message
                        : `Unable to start payment for ${propertyTitle}.`,
            });
        },
    });

    const isPending = paymentMutation.isPending;
    const isContinuingPayment =
        payment?.status === "PENDING";

    const buttonLabel = isContinuingPayment
        ? "Continue Stripe payment"
        : "Pay securely with Stripe";

    const supportingText = isContinuingPayment
        ? "Resume your existing secure checkout session."
        : "Complete the approved rental payment through Stripe Checkout.";

    return (
        <div className="rounded-2xl border border-info/20 bg-info-soft p-3">
            <button
                type="button"
                onClick={() => paymentMutation.mutate()}
                disabled={isPending}
                aria-label={`${buttonLabel} for ${propertyTitle}`}
                className="group flex min-h-14 w-full items-center gap-3 rounded-xl bg-brand px-4 py-3 text-left text-brand-foreground shadow-soft transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
            >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-foreground/15">
                    {isPending ? (
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-5 animate-spin"
                        />
                    ) : (
                        <CreditCard
                            aria-hidden="true"
                            className="size-5"
                        />
                    )}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">
                        {isPending
                            ? "Opening Stripe Checkout..."
                            : buttonLabel}
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-brand-foreground/80">
                        {isPending
                            ? "Please wait while the secure payment page opens."
                            : supportingText}
                    </span>
                </span>

                {!isPending && (
                    <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                )}
            </button>

            <div className="mt-3 flex items-start gap-2 px-1">
                <ShieldCheck
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-info"
                />

                <p className="text-xs leading-5 text-muted-foreground">
                    Payment is processed securely by Stripe. RESTNEST
                    does not collect your card information.
                </p>
            </div>
        </div>
    );
}