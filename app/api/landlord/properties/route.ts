import { NextResponse } from "next/server";

import { createApiRouteErrorResponse, createInvalidBodyResponse } from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type {
    CreatePropertyInput,
    LandlordProperty,
} from "@/types/property";

export async function GET() {
    try {
        const response = await authenticatedApiRequest<
            LandlordProperty[]
        >("/landlord/properties", {
            method: "GET",
        });

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}

export async function POST(request: Request) {
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
                "/landlord/properties",
                {
                    method: "POST",
                    body: requestBody as CreatePropertyInput,
                },
            );

        return NextResponse.json(response, {
            status: 201,
        });
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}