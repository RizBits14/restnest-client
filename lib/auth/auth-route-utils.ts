import { NextResponse } from "next/server";

import { ApiError } from "@/lib/api/api-client";

export function createValidationErrorResponse(
    message: string,
) {
    return NextResponse.json(
        {
            success: false,
            message,
        },
        {
            status: 400,
        },
    );
}

export function createAuthRouteErrorResponse(
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

    console.error("Unexpected authentication error:", error);

    return NextResponse.json(
        {
            success: false,
            message:
                "The authentication request could not be completed.",
        },
        {
            status: 500,
        },
    );
}