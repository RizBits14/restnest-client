import { z } from "zod";

function isNonNegativeInteger(value: string) {
    const parsedValue = Number(value);

    return (
        value.trim() !== "" &&
        Number.isInteger(parsedValue) &&
        parsedValue >= 0
    );
}

function isPositiveNumber(value: string) {
    const parsedValue = Number(value);

    return (
        value.trim() !== "" &&
        Number.isFinite(parsedValue) &&
        parsedValue > 0
    );
}

function isValidOptionalPositiveNumber(value: string) {
    return value.trim() === "" || isPositiveNumber(value);
}

function hasValidImageUrls(value: string) {
    if (!value.trim()) {
        return true;
    }

    return value
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
        .every((url) => {
            try {
                const parsedUrl = new URL(url);

                return (
                    parsedUrl.protocol === "http:" ||
                    parsedUrl.protocol === "https:"
                );
            } catch {
                return false;
            }
        });
}

export const createPropertySchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Property title must contain at least 3 characters.")
        .max(120, "Property title must contain 120 characters or fewer."),

    description: z
        .string()
        .trim()
        .min(20, "Description must contain at least 20 characters.")
        .max(2_000, "Description must contain 2,000 characters or fewer."),

    location: z
        .string()
        .trim()
        .min(2, "Location must contain at least 2 characters.")
        .max(100, "Location must contain 100 characters or fewer."),

    address: z
        .string()
        .trim()
        .max(180, "Address must contain 180 characters or fewer."),

    price: z
        .string()
        .trim()
        .refine(isPositiveNumber, {
            message: "Enter a total rental price greater than 0.",
        }),

    bedrooms: z
        .string()
        .trim()
        .refine(isNonNegativeInteger, {
            message: "Bedrooms must be a whole number of 0 or more.",
        }),

    bathrooms: z
        .string()
        .trim()
        .refine(isNonNegativeInteger, {
            message: "Bathrooms must be a whole number of 0 or more.",
        }),

    area: z
        .string()
        .trim()
        .refine(isValidOptionalPositiveNumber, {
            message: "Area must be greater than 0.",
        }),

    categoryId: z
        .string()
        .trim()
        .min(1, "Choose a property type."),

    amenities: z
        .string()
        .trim()
        .max(1_000, "Amenities must contain 1,000 characters or fewer."),

    imageUrls: z
        .string()
        .trim()
        .max(3_000, "Image URLs must contain 3,000 characters or fewer.")
        .refine(hasValidImageUrls, {
            message:
                "Enter one valid HTTP or HTTPS image URL per line.",
        }),
});

export const editPropertySchema = createPropertySchema.extend({
    status: z.enum([
        "AVAILABLE",
        "RENTED",
        "UNAVAILABLE",
    ]),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;
export type EditPropertyFormValues = z.infer<typeof editPropertySchema>;