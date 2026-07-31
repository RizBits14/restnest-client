import type { ApiSuccessResponse } from "@/types/api";
import type { RentalReview } from "@/types/rental";

type ErrorResponse = {
    success?: false;
    message?: string;
};

export type CreateTenantReviewInput = {
    rentalRequestId: string;
    rating: number;
    comment?: string;
};

async function parseResponse<T>(
    response: Response,
) {
    try {
        return (await response.json()) as
            | ApiSuccessResponse<T>
            | ErrorResponse;
    } catch {
        return null;
    }
}

export async function createTenantReview(
    input: CreateTenantReviewInput,
) {
    let response: Response;

    try {
        response = await fetch("/api/reviews", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
    } catch {
        throw new Error(
            "Unable to submit the review. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<RentalReview>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw new Error(
            result?.message ||
            "The review could not be submitted.",
        );
    }

    return result.data;
}