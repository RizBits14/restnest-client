import { NextResponse } from "next/server";

import { createApiRouteErrorResponse } from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { AdminProperty } from "@/types/admin";

export async function GET() {
    try {
        const response =
            await authenticatedApiRequest<
                AdminProperty[]
            >("/admin/properties");

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(
            error,
        );
    }
}