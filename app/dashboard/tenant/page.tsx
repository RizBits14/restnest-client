import type { Metadata } from "next";

import { TenantOverviewPanel } from "@/components/dashboard/tenant/tenant-overview-panel";

export const metadata: Metadata = {
    title: "Tenant Dashboard",
};

export default function TenantDashboardPage() {
    return <TenantOverviewPanel />;
}