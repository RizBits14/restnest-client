import type { Metadata } from "next";

import { LandlordOverviewPanel } from "@/components/dashboard/landlord/landlord-overview-panel";

export const metadata: Metadata = {
    title: "Landlord Dashboard",
    description:
        "Manage RESTNEST property listings, monitor availability, review tenant requests, and track active rentals.",
};

export default function LandlordDashboardPage() {
    return <LandlordOverviewPanel />;
}