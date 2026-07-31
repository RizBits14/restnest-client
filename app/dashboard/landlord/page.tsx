import type { Metadata } from "next";

import { LandlordOverviewPanel } from "@/components/dashboard/landlord/landlord-overview-panel";

export const metadata: Metadata = {
    title: "Landlord Dashboard",
};

export default function LandlordDashboardPage() {
    return <LandlordOverviewPanel />;
}