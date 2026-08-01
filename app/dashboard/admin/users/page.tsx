import type { Metadata } from "next";

import { AdminUsersPanel } from "@/components/dashboard/admin/admin-users-panel";

export const metadata: Metadata = {
    title: "Manage Users",
    description:
        "Search RESTNEST users, review account roles and contact details, and manage active or banned platform access.",
};

export default function AdminUsersPage() {
    return <AdminUsersPanel />;
}