import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type {
    CreateRentalRequestInput,
    TenantRentalRequest,
} from "@/types/rental";

function isCreateRentalRequestInput(
    value: unknown,
): value is CreateRentalRequestInput {
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

    const hasValidMessage =
        body.message === undefined ||
        typeof body.message === "string";

    return (
        typeof body.propertyId === "string" &&
        body.propertyId.trim() !== "" &&
        typeof body.moveInDate === "string" &&
        body.moveInDate.trim() !== "" &&
        !Number.isNaN(
            Date.parse(body.moveInDate),
        ) &&
        typeof body.duration === "number" &&
        Number.isInteger(body.duration) &&
        body.duration > 0 &&
        hasValidMessage
    );
}

export async function GET() {
    try {
        const response =
            await authenticatedApiRequest<
                TenantRentalRequest[]
            >("/rentals", {
                method: "GET",
            });

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
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
        !isCreateRentalRequestInput(
            requestBody,
        )
    ) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<
                TenantRentalRequest
            >("/rentals", {
                method: "POST",
                body: requestBody,
            });

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}