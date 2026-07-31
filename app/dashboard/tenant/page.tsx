import type { Metadata } from "next";

import { RoleOverview } from "@/components/dashboard/role-overview";

export const metadata: Metadata = {
    title: "Tenant Dashboard",
};

export default function TenantDashboardPage() {
    return <RoleOverview role="TENANT" />;
}