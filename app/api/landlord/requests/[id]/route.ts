import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type {
    LandlordRentalRequest,
    RentalDecision,
} from "@/types/rental";

type RentalRequestRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function isRentalDecision(
    value: unknown,
): value is RentalDecision {
    return (
        value === "APPROVED" ||
        value === "REJECTED"
    );
}

export async function PATCH(
    request: Request,
    context: RentalRequestRouteContext,
) {
    const { id } = await context.params;

    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createInvalidBodyResponse();
    }

    if (
        typeof requestBody !== "object" ||
        requestBody === null ||
        Array.isArray(requestBody) ||
        !("status" in requestBody) ||
        !isRentalDecision(requestBody.status)
    ) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<LandlordRentalRequest>(
                `/landlord/requests/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",
                    body: {
                        status: requestBody.status,
                    },
                },
            );

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}