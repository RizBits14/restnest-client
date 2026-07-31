import type { ApiSuccessResponse } from "@/types/api";
import type { LandlordProperty } from "@/types/property";

type ErrorResponse = {
    success?: false;
    message?: string;
};

async function parseResponse(response: Response) {
    try {
        return (await response.json()) as
            | ApiSuccessResponse<LandlordProperty[]>
            | ErrorResponse;
    } catch {
        return null;
    }
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

    const result = await parseResponse(response);

    if (!response.ok || !result?.success) {
        throw new Error(
            result?.message ||
            "Your properties could not be loaded.",
        );
    }

    return result.data ?? [];
}