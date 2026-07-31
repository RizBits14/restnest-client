import { z } from "zod";

export const rentalReviewSchema = z.object({
    rating: z
        .number()
        .int()
        .min(1, "Select a rating.")
        .max(5, "Rating cannot exceed 5."),
    comment: z
        .string()
        .trim()
        .max(
            1000,
            "Review comment cannot exceed 1000 characters.",
        ),
});

export type RentalReviewFormValues = z.infer<
    typeof rentalReviewSchema
>;