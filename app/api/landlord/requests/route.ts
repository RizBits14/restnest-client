import { NextResponse } from "next/server";

import { createApiRouteErrorResponse } from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { LandlordRentalRequest } from "@/types/rental";

export async function GET() {
    try {
        const response = await authenticatedApiRequest<
            LandlordRentalRequest[]
        >("/landlord/requests", {
            method: "GET",
        });

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(error);
    }
}