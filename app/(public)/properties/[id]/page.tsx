import { PropertyDetailsView } from "@/components/properties/property-details-view";

type PropertyDetailsPageProps = Readonly<{
    params: Promise<{
        id: string;
    }>;
}>;

export default async function PropertyDetailsPage({
    params,
}: PropertyDetailsPageProps) {
    const { id } = await params;

    return (
        <PropertyDetailsView
            propertyId={id}
        />
    );
}