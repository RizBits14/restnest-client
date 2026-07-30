import { z } from "zod";

const optionalPriceSchema = z
    .string()
    .trim()
    .refine(
        (value) =>
            value === "" ||
            (!Number.isNaN(Number(value)) && Number(value) >= 0),
        {
            message: "Enter a valid price of 0 or more.",
        },
    );

export const propertyFilterSchema = z
    .object({
        location: z
            .string()
            .trim()
            .max(80, "Location must be 80 characters or fewer."),

        categoryId: z.string(),

        minPrice: optionalPriceSchema,

        maxPrice: optionalPriceSchema,
    })
    .refine(
        (values) => {
            if (!values.minPrice || !values.maxPrice) {
                return true;
            }

            return Number(values.minPrice) <= Number(values.maxPrice);
        },
        {
            message:
                "Maximum price must be greater than or equal to minimum price.",
            path: ["maxPrice"],
        },
    );

export type PropertyFilterFormValues = z.infer<
    typeof propertyFilterSchema
>;