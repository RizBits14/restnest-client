import { NextResponse } from "next/server";

import { apiRequest } from "@/lib/api/api-client";
import {
    createAuthRouteErrorResponse,
    createValidationErrorResponse,
} from "@/lib/auth/auth-route-utils";
import { registerSchema } from "@/lib/validation/auth-schema";
import type { AuthUser } from "@/types/auth";

export async function POST(request: Request) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createValidationErrorResponse(
            "The registration information is invalid.",
        );
    }

    const validationResult =
        registerSchema.safeParse(requestBody);

    if (!validationResult.success) {
        return createValidationErrorResponse(
            validationResult.error.issues[0]?.message ??
            "Enter valid registration information.",
        );
    }

    const {
        name,
        email,
        password,
        role,
        phone,
    } = validationResult.data;

    const registrationPayload = {
        name,
        email,
        password,
        role,
        ...(phone ? { phone } : {}),
    };

    try {
        const response = await apiRequest<AuthUser>(
            "/auth/register",
            {
                method: "POST",
                body: registrationPayload,
                cache: "no-store",
            },
        );

        if (!response.data) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "RESTNEST returned an incomplete registration response.",
                },
                {
                    status: 502,
                },
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: response.message,
                data: {
                    user: response.data,
                },
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        return createAuthRouteErrorResponse(error);
    }
}