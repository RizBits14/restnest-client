import type { ApiSuccessResponse } from "@/types/api";
import type { RentalPayment } from "@/types/rental";

type ErrorResponse = {
    success?: false;
    message?: string;
};

type CreatePaymentInput = {
    rentalRequestId: string;
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

export async function createTenantPayment(
    input: CreatePaymentInput,
) {
    let response: Response;

    try {
        response = await fetch(
            "/api/payments/create",
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
            "Unable to start the payment. Check your connection and try again.",
        );
    }

    const result =
        await parseResponse<RentalPayment>(
            response,
        );

    if (
        !response.ok ||
        !result?.success ||
        !result.data
    ) {
        throw getResponseError(
            result,
            "The payment could not be started.",
        );
    }

    if (!result.data.paymentUrl) {
        throw new Error(
            "Stripe Checkout URL was not returned.",
        );
    }

    return result.data;
}