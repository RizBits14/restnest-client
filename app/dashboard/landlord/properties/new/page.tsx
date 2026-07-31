import type { Metadata } from "next";

import { CreatePropertyForm } from "@/components/dashboard/landlord/create-property-form";

export const metadata: Metadata = {
    title: "Create Property",
    description:
        "Create a new RESTNEST rental property listing.",
};

export default function CreatePropertyPage() {
    return <CreatePropertyForm />;
}