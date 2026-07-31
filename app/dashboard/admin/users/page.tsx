import type { Metadata } from "next";

import { AdminUsersPanel } from "@/components/dashboard/admin/admin-users-panel";

export const metadata: Metadata = {
    title: "Manage Users",
};

export default function AdminUsersPage() {
    return <AdminUsersPanel />;
}