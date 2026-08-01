import type { Metadata } from "next";

import { TenantOverviewPanel } from "@/components/dashboard/tenant/tenant-overview-panel";

export const metadata: Metadata = {
    title: "Tenant Dashboard",
    description:
        "Review rental requests, payment-ready properties, active rentals, and review eligibility from your RESTNEST tenant dashboard.",
};

export default function TenantDashboardPage() {
    return <TenantOverviewPanel />;
}