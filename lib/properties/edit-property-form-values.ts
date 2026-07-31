import type { EditPropertyFormValues } from "@/lib/validation/property-schema";
import type { LandlordProperty } from "@/types/property";

export function createEditPropertyFormValues(
    property: LandlordProperty,
): EditPropertyFormValues {
    return {
        title: property.title,
        description: property.description,
        location: property.location,
        address: property.address ?? "",
        price: String(property.price),
        bedrooms: String(property.bedrooms),
        bathrooms: String(property.bathrooms),
        area:
            property.area === null
                ? ""
                : String(property.area),
        categoryId: property.categoryId,
        amenities: property.amenities.join(", "),
        imageUrls: property.images.join("\n"),
        status: property.status,
    };
}