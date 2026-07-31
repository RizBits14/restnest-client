import type { Metadata } from "next";

import { RoleOverview } from "@/app/dashboard/role-overview";

export const metadata: Metadata = {
    title: "Tenant Dashboard",
};

export default function TenantDashboardPage() {
    return <RoleOverview role="TENANT" />;
}