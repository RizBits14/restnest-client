import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { RentalPayment } from "@/types/rental";

type CreatePaymentInput = {
    rentalRequestId: string;
};

function isCreatePaymentInput(
    value: unknown,
): value is CreatePaymentInput {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const body = value as Record<string, unknown>;

    return (
        typeof body.rentalRequestId === "string" &&
        body.rentalRequestId.trim() !== ""
    );
}

export async function POST(request: Request) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createInvalidBodyResponse();
    }

    if (!isCreatePaymentInput(requestBody)) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<RentalPayment>(
                "/payments/create",
                {
                    method: "POST",
                    body: {
                        rentalRequestId:
                            requestBody.rentalRequestId,
                    },
                },
            );

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}