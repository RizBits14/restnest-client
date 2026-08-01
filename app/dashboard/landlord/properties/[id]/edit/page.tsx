import type { Metadata } from "next";

import { EditPropertyForm } from "@/components/dashboard/landlord/edit-property-form";

export const metadata: Metadata = {
    title: "Edit Property",
    description:
        "Update property information, pricing, availability, amenities, and listing images from the RESTNEST landlord dashboard.",
};

type EditPropertyPageProps = Readonly<{
    params: Promise<{
        id: string;
    }>;
}>;

export default async function EditPropertyPage({
    params,
}: EditPropertyPageProps) {
    const { id } = await params;

    return <EditPropertyForm propertyId={id} />;
}