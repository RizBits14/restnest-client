import type { Metadata } from "next";

import { LandlordRequestsPanel } from "@/components/dashboard/landlord/landlord-requests-panel";

export const metadata: Metadata = {
    title: "Rental Requests",
    description:
        "Review tenant details, rental dates, messages, and approve or reject pending requests from the RESTNEST landlord dashboard.",
};

export default function LandlordRequestsPage() {
    return <LandlordRequestsPanel />;
}