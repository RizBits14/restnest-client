import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { LandlordProperty } from "@/types/property";

type PropertyRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function isRequestBodyValid(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length > 0
    );
}

export async function GET(
    _request: Request,
    context: PropertyRouteContext,
) {
    const { id } = await context.params;

    try {
        const response =
            await authenticatedApiRequest<LandlordProperty[]>(
                "/landlord/properties",
                {
                    method: "GET",
                },
            );

        const property = response.data?.find(
            (item) => item.id === id,
        );

        if (!property) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The property was not found or does not belong to your account.",
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Property retrieved successfully.",
            data: property,
        });
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}

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

    if (!isRequestBodyValid(requestBody)) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<LandlordProperty>(
                `/landlord/properties/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",
                    body: requestBody,
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