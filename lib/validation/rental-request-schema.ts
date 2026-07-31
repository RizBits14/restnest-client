import { z } from "zod";

function isPositiveInteger(value: string) {
    const parsedValue = Number(value);

    return (
        value.trim() !== "" &&
        Number.isInteger(parsedValue) &&
        parsedValue > 0
    );
}

function isTodayOrFuture(value: string) {
    if (!value) {
        return false;
    }

    const selectedDate = new Date(
        `${value}T00:00:00`,
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return (
        !Number.isNaN(selectedDate.getTime()) &&
        selectedDate >= today
    );
}

export const rentalRequestSchema = z.object({
    moveInDate: z
        .string()
        .min(1, "Choose a move-in date.")
        .refine(isTodayOrFuture, {
            message:
                "Move-in date must be today or a future date.",
        }),

    duration: z
        .string()
        .trim()
        .refine(isPositiveInteger, {
            message:
                "Duration must be a positive whole number.",
        }),

    message: z
        .string()
        .trim()
        .max(
            1_000,
            "Message must contain 1,000 characters or fewer.",
        ),
});

export type RentalRequestFormValues =
    z.infer<typeof rentalRequestSchema>;