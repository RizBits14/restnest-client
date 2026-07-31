import type { Metadata } from "next";

import { AdminPropertiesPanel } from "@/components/dashboard/admin/admin-properties-panel";

export const metadata: Metadata = {
    title: "Inspect Properties",
};

export default function AdminPropertiesPage() {
    return <AdminPropertiesPanel />;
}