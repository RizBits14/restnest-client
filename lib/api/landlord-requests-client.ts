import type { ApiSuccessResponse } from "@/types/api";
import type {
    LandlordRentalRequest,
    RentalDecision,
} from "@/types/rental";

export const landlordRequestsQueryKey = [
    "landlord",
    "requests",
] as const;

type ErrorResponse = {
    success?: false;
    message?: string;
};

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

export async function getLandlordRequests() {
    let response: Response;

    try {
        response = await fetch(
            "/api/landlord/requests",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load rental requests. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<
            LandlordRentalRequest[]
        >(response);

    if (!response.ok || !result?.success) {
        throw getResponseError(
            result,
            "Rental requests could not be loaded.",
        );
    }

    return result.data ?? [];
}

export async function updateLandlordRequest(
    requestId: string,
    status: RentalDecision,
) {
    let response: Response;

    try {
        response = await fetch(
            `/api/landlord/requests/${encodeURIComponent(requestId)}`,
            {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status,
                }),
            },
        );
    } catch {
        throw new Error(
            "Unable to update the rental request. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<LandlordRentalRequest>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The rental request could not be updated.",
        );
    }

    return result.data;
}