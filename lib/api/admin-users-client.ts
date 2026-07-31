import type { AdminUser } from "@/types/admin";
import type { ApiSuccessResponse } from "@/types/api";
import type { UserStatus } from "@/types/auth";

type ErrorResponse = {
    success?: false;
    message?: string;
};

export const adminUsersQueryKey = [
    "admin",
    "users",
] as const;

async function parseResponse<T>(
    response: Response,
) {
    try {
        return (await response.json()) as
            | ApiSuccessResponse<T>
            | ErrorResponse;
    } catch {
        return null;
    }
}

function getResponseMessage(
    result: unknown,
) {
    if (
        typeof result !== "object" ||
        result === null ||
        !("message" in result) ||
        typeof result.message !== "string"
    ) {
        return null;
    }

    return result.message;
}

function createResponseError(
    result: unknown,
    fallbackMessage: string,
) {
    return new Error(
        getResponseMessage(result) ||
        fallbackMessage,
    );
}

export async function getAdminUsers() {
    let response: Response;

    try {
        response = await fetch(
            "/api/admin/users",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load users. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<AdminUser[]>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw createResponseError(
            result,
            "The user list could not be loaded.",
        );
    }

    return result.data;
}

type UpdateAdminUserStatusInput = {
    userId: string;
    status: UserStatus;
};

export async function updateAdminUserStatus({
    userId,
    status,
}: UpdateAdminUserStatusInput) {
    let response: Response;

    try {
        response = await fetch(
            `/api/admin/users/${encodeURIComponent(userId)}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    status,
                }),
            },
        );
    } catch {
        throw new Error(
            "Unable to update the user. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<AdminUser>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw createResponseError(
            result,
            "The user status could not be updated.",
        );
    }

    return result.data;
}