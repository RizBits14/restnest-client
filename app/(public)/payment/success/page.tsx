import type { Metadata } from "next";

import { PaymentSuccessView } from "@/components/payment/payment-success-view";

export const metadata: Metadata = {
    title: "Payment Submitted",
    description:
        "RESTNEST is confirming your Stripe payment and updating your rental status.",
};

export default function PaymentSuccessPage() {
    return <PaymentSuccessView />;
}