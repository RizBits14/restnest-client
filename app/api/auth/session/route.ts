import { NextResponse } from "next/server";

import { apiRequest, ApiError } from "@/lib/api/api-client";
import {
    clearAuthToken,
    getAuthToken,
} from "@/lib/auth/auth-cookie";
import { createAuthRouteErrorResponse } from "@/lib/auth/auth-route-utils";
import type { AuthUser } from "@/types/auth";

export async function GET() {
    const token = await getAuthToken();

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                message: "You are not signed in.",
            },
            {
                status: 401,
            },
        );
    }

    try {
        const response = await apiRequest<AuthUser>(
            "/auth/me",
            {
                method: "GET",
                token,
                cache: "no-store",
            },
        );

        if (!response.data) {
            await clearAuthToken();

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Your session could not be verified.",
                },
                {
                    status: 401,
                },
            );
        }

        return NextResponse.json({
            success: true,
            message: response.message,
            data: {
                user: response.data,
            },
        });
    } catch (error) {
        if (
            error instanceof ApiError &&
            (error.status === 401 ||
                error.status === 403 ||
                error.status === 404)
        ) {
            await clearAuthToken();
        }

        return createAuthRouteErrorResponse(error);
    }
}