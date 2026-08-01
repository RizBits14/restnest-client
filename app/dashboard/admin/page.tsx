import type { Metadata } from "next";

import { AdminOverviewPanel } from "@/components/dashboard/admin/admin-overview-panel";

export const metadata: Metadata = {
    title: "Admin Dashboard",
    description:
        "Monitor RESTNEST users, account access, property listings, and marketplace availability from the administrative dashboard.",
};

export default function AdminDashboardPage() {
    return <AdminOverviewPanel />;
}