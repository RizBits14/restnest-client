import type { Metadata } from "next";

import { TenantRentalsPanel } from "@/components/dashboard/tenant/tenant-rentals-panel";

export const metadata: Metadata = {
    title: "My Rentals",
    description:
        "Track rental requests, landlord decisions, payments, active rentals, and review eligibility from your RESTNEST tenant dashboard.",
};

export default function TenantRentalsPage() {
    return <TenantRentalsPanel />;
}