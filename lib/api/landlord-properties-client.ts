import type { ApiSuccessResponse } from "@/types/api";
import type {
    CreatePropertyInput,
    LandlordProperty,
    UpdatePropertyInput,
} from "@/types/property";

export const landlordPropertiesQueryKey = [
    "landlord",
    "properties",
] as const;

export function landlordPropertyQueryKey(
    propertyId: string,
) {
    return [
        ...landlordPropertiesQueryKey,
        propertyId,
    ] as const;
}

type ErrorResponse = {
    success?: false;
    message?: string;
};

async function parseResponse<T>(response: Response) {
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

export async function getLandlordProperties() {
    let response: Response;

    try {
        response = await fetch("/api/landlord/properties", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });
    } catch {
        throw new Error(
            "Unable to load your properties. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordProperty[]>(response);

    if (!response.ok || !result?.success) {
        throw getResponseError(
            result,
            "Your properties could not be loaded.",
        );
    }

    return result.data ?? [];
}

export async function createLandlordProperty(
    input: CreatePropertyInput,
) {
    let response: Response;

    try {
        response = await fetch("/api/landlord/properties", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
    } catch {
        throw new Error(
            "Unable to create the property. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordProperty>(response);

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The property could not be created.",
        );
    }

    return result.data;
}

export async function getLandlordProperty(
    propertyId: string,
) {
    let response: Response;

    try {
        response = await fetch(
            `/api/landlord/properties/${encodeURIComponent(propertyId)}`,
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load the property. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordProperty>(response);

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

export async function updateLandlordProperty(
    propertyId: string,
    input: UpdatePropertyInput,
) {
    let response: Response;

    try {
        response = await fetch(
            `/api/landlord/properties/${encodeURIComponent(propertyId)}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            },
        );
    } catch {
        throw new Error(
            "Unable to update the property. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordProperty>(response);

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The property could not be updated.",
        );
    }

    return result.data;
}

export async function deleteLandlordProperty(
    propertyId: string,
) {
    let response: Response;

    try {
        response = await fetch(
            `/api/landlord/properties/${encodeURIComponent(propertyId)}`,
            {
                method: "DELETE",
                credentials: "include",
            },
        );
    } catch {
        throw new Error(
            "Unable to delete the property. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordProperty>(response);

    if (!response.ok || !result?.success) {
        throw getResponseError(
            result,
            "The property could not be deleted.",
        );
    }

    return result.data;
}