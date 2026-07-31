import type { ApiSuccessResponse } from "@/types/api";
import type {
    CreateRentalRequestInput,
    TenantRentalRequest,
} from "@/types/rental";

export const tenantRentalsQueryKey = [
    "tenant",
    "rentals",
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

export async function getTenantRentals() {
    let response: Response;

    try {
        response = await fetch(
            "/api/rentals",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            },
        );
    } catch {
        throw new Error(
            "Unable to load your rental requests. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<
            TenantRentalRequest[]
        >(response);

    if (!response.ok || !result?.success) {
        throw getResponseError(
            result,
            "Your rental requests could not be loaded.",
        );
    }

    return result.data ?? [];
}

export async function createTenantRentalRequest(
    input: CreateRentalRequestInput,
) {
    let response: Response;

    try {
        response = await fetch(
            "/api/rentals",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            },
        );
    } catch {
        throw new Error(
            "Unable to submit the rental request. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<
            TenantRentalRequest
        >(response);

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The rental request could not be submitted.",
        );
    }

    return result.data;
}