import { EditPropertyForm } from "@/components/dashboard/landlord/edit-property-form";

type EditPropertyPageProps = Readonly<{
    params: Promise<{
        id: string;
    }>;
}>;

export default async function EditPropertyPage({
    params,
}: EditPropertyPageProps) {
    const { id } = await params;

    return (
        <EditPropertyForm propertyId={id} />
    );
}