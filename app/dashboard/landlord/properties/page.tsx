import type { Metadata } from "next";

import { LandlordPropertiesPanel } from "@/components/dashboard/landlord/landlord-properties-panel";

export const metadata: Metadata = {
    title: "My Properties",
    description:
        "Manage your RESTNEST rental property listings.",
};

export default function LandlordPropertiesPage() {
    return <LandlordPropertiesPanel />;
}