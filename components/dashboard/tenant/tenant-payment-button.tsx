"use client";

import { useMutation } from "@tanstack/react-query";
import {
    CreditCard,
    LoaderCircle,
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

    const isPending =
        paymentMutation.isPending;

    const buttonLabel =
        payment?.status === "PENDING"
            ? "Continue Stripe payment"
            : "Pay with Stripe";

    return (
        <button
            type="button"
            onClick={() =>
                paymentMutation.mutate()
            }
            disabled={isPending}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
            {isPending ? (
                <>
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin"
                    />
                    Opening Stripe...
                </>
            ) : (
                <>
                    <CreditCard
                        aria-hidden="true"
                        className="size-4"
                    />
                    {buttonLabel}
                </>
            )}
        </button>
    );
}