import type { Metadata } from "next";

import { RoleOverview } from "@/components/dashboard/role-overview";

export const metadata: Metadata = {
    title: "Landlord Dashboard",
};

export default function LandlordDashboardPage() {
    return <RoleOverview role="LANDLORD" />;
}