import { NextResponse } from "next/server";

import { ApiError } from "@/lib/api/api-client";

export function createApiRouteErrorResponse(
    error: unknown,
) {
    if (error instanceof ApiError) {
        const status =
            error.status >= 400 && error.status <= 599
                ? error.status
                : 503;

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status,
            },
        );
    }

    console.error(
        "Unexpected protected API route error:",
        error,
    );

    return NextResponse.json(
        {
            success: false,
            message:
                "The request could not be completed. Please try again.",
        },
        {
            status: 500,
        },
    );
}

export function createInvalidBodyResponse() {
    return NextResponse.json(
        {
            success: false,
            message:
                "The submitted information is invalid.",
        },
        {
            status: 400,
        },
    );
}