import type { AdminProperty } from "@/types/admin";
import type { ApiSuccessResponse } from "@/types/api";

type ErrorResponse = {
    success?: false;
    message?: string;
};

export const adminPropertiesQueryKey = [
    "admin",
    "properties",
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

export async function getAdminProperties() {
    let response: Response;

    try {
        response = await fetch(
            "/api/admin/properties",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load properties. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<AdminProperty[]>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw new Error(
            getResponseMessage(result) ||
            "The property list could not be loaded.",
        );
    }

    return result.data;
}