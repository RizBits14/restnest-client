import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { RentalReview } from "@/types/rental";

type CreateReviewBody = {
    rentalRequestId: string;
    rating: number;
    comment?: string;
};

function isCreateReviewBody(
    value: unknown,
): value is CreateReviewBody {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const body = value as Record<
        string,
        unknown
    >;

    const hasValidComment =
        body.comment === undefined ||
        typeof body.comment === "string";

    return (
        typeof body.rentalRequestId ===
        "string" &&
        body.rentalRequestId.trim() !== "" &&
        typeof body.rating === "number" &&
        Number.isInteger(body.rating) &&
        body.rating >= 1 &&
        body.rating <= 5 &&
        hasValidComment
    );
}

export async function POST(
    request: Request,
) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createInvalidBodyResponse();
    }

    if (
        !isCreateReviewBody(requestBody)
    ) {
        return createInvalidBodyResponse();
    }

    const comment =
        requestBody.comment?.trim();

    try {
        const response =
            await authenticatedApiRequest<RentalReview>(
                "/reviews",
                {
                    method: "POST",
                    body: {
                        rentalRequestId:
                            requestBody.rentalRequestId,
                        rating: requestBody.rating,
                        ...(comment
                            ? { comment }
                            : {}),
                    },
                },
            );

        return NextResponse.json(response, {
            status: 201,
        });
    } catch (error) {
        return createApiRouteErrorResponse(
            error,
        );
    }
}