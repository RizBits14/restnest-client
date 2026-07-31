import type { Metadata } from "next";

import { AdminOverviewPanel } from "@/components/dashboard/admin/admin-overview-panel";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
    return <AdminOverviewPanel />;
}