import { NextResponse } from "next/server";

import { createApiRouteErrorResponse, createInvalidBodyResponse } from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type {
    LandlordProperty,
    UpdatePropertyInput,
} from "@/types/property";

type PropertyRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: PropertyRouteContext,
) {
    const { id } = await context.params;

    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createInvalidBodyResponse();
    }

    if (
        !requestBody ||
        typeof requestBody !== "object" ||
        Array.isArray(requestBody)
    ) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<LandlordProperty>(
                `/landlord/properties/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",
                    body: requestBody as UpdatePropertyInput,
                },
            );

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}

export async function DELETE(
    _request: Request,
    context: PropertyRouteContext,
) {
    const { id } = await context.params;

    try {
        const response =
            await authenticatedApiRequest<LandlordProperty>(
                `/landlord/properties/${encodeURIComponent(id)}`,
                {
                    method: "DELETE",
                },
            );

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}