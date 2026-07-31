import type { Metadata } from "next";

import { RoleOverview } from "@/components/dashboard/role-overview";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
    return <RoleOverview role="ADMIN" />;
}