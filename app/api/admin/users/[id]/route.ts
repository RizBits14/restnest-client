import { NextResponse } from "next/server";

import {
    createApiRouteErrorResponse,
    createInvalidBodyResponse,
} from "@/lib/api/api-route-utils";
import { authenticatedApiRequest } from "@/lib/api/authenticated-api-request";
import type { AdminUser } from "@/types/admin";
import type { UserStatus } from "@/types/auth";

type UpdateUserStatusBody = {
    status: UserStatus;
};

function isUpdateUserStatusBody(
    value: unknown,
): value is UpdateUserStatusBody {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const body = value as Record<
        string,
        unknown
    >;

    return (
        body.status === "ACTIVE" ||
        body.status === "BANNED"
    );
}

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext,
) {
    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
        return createInvalidBodyResponse();
    }

    if (
        !isUpdateUserStatusBody(requestBody)
    ) {
        return createInvalidBodyResponse();
    }

    const { id } = await context.params;

    if (!id.trim()) {
        return createInvalidBodyResponse();
    }

    try {
        const response =
            await authenticatedApiRequest<AdminUser>(
                `/admin/users/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",
                    body: {
                        status: requestBody.status,
                    },
                },
            );

        return NextResponse.json(response);
    } catch (error) {
        return createApiRouteErrorResponse(
            error,
        );
    }
}