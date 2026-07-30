import { NextResponse } from "next/server";

import { apiRequest, ApiError } from "@/lib/api/api-client";
import { setAuthToken } from "@/lib/auth/auth-cookie";
import {
    createAuthRouteErrorResponse,
    createValidationErrorResponse,
} from "@/lib/auth/auth-route-utils";
import { loginSchema } from "@/lib/validation/auth-schema";
import type { LoginResult } from "@/types/auth";

export async function POST(request: Request) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createValidationErrorResponse(
            "The login information is invalid.",
        );
    }

    const validationResult =
        loginSchema.safeParse(requestBody);

    if (!validationResult.success) {
        return createValidationErrorResponse(
            validationResult.error.issues[0]?.message ??
            "Enter valid login information.",
        );
    }

    try {
        const response = await apiRequest<LoginResult>(
            "/auth/login",
            {
                method: "POST",
                body: validationResult.data,
                cache: "no-store",
            },
        );

        if (
            !response.data?.accessToken ||
            !response.data.user
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "RESTNEST returned an incomplete login response.",
                },
                {
                    status: 502,
                },
            );
        }

        await setAuthToken(response.data.accessToken);

        return NextResponse.json({
            success: true,
            message: response.message,
            data: {
                user: response.data.user,
            },
        });
    } catch (error) {
        if (
            error instanceof ApiError &&
            (error.status === 401 || error.status === 404)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password.",
                },
                {
                    status: 401,
                },
            );
        }

        return createAuthRouteErrorResponse(error);
    }
}