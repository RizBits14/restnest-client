import type { CreatePropertyFormValues } from "@/lib/validation/property-schema";
import type { CreatePropertyInput } from "@/types/property";

function splitAmenities(value: string) {
    return value
        .split(/,|\r?\n/)
        .map((amenity) => amenity.trim())
        .filter(Boolean);
}

function splitImageUrls(value: string) {
    return value
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean);
}

export function createPropertyPayload(
    values: CreatePropertyFormValues,
): CreatePropertyInput {
    const amenities = splitAmenities(values.amenities);
    const images = splitImageUrls(values.imageUrls);

    return {
        title: values.title.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        price: Number(values.price),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        categoryId: values.categoryId,

        ...(values.address.trim()
            ? { address: values.address.trim() }
            : {}),

        ...(values.area.trim()
            ? { area: Number(values.area) }
            : {}),

        ...(amenities.length > 0
            ? { amenities }
            : {}),

        ...(images.length > 0
            ? { images }
            : {}),
    };
}