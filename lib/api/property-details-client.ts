import type { ApiSuccessResponse } from "@/types/api";
import type { PropertyDetails } from "@/types/property";

type ErrorResponse = {
    success?: false;
    message?: string;
};

export function propertyDetailsQueryKey(
    propertyId: string,
) {
    return [
        "properties",
        "details",
        propertyId,
    ] as const;
}

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

function getResponseError(
    result: { message?: string } | null,
    fallbackMessage: string,
) {
    return new Error(
        result?.message || fallbackMessage,
    );
}

export async function getPropertyDetails(
    propertyId: string,
) {
    let response: Response;

    try {
        response = await fetch(
            `/api/properties/${encodeURIComponent(propertyId)}`,
            {
                method: "GET",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load the property. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<PropertyDetails>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The property could not be loaded.",
        );
    }

    return result.data;
}