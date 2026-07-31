import { appConfig } from "@/lib/config";
import type {
    ApiErrorResponse,
    ApiSuccessResponse,
} from "@/types/api";

type JsonRequestBody = Record<string, unknown> | unknown[];

export type ApiRequestOptions = Omit<
    RequestInit,
    "body" | "headers"
> & {
    body?: JsonRequestBody | FormData;
    headers?: HeadersInit;
    token?: string;
};

export class ApiError extends Error {
    readonly status: number;
    readonly details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

function createApiUrl(endpoint: string) {
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");

    return `${appConfig.apiBaseUrl}/${normalizedEndpoint}`;
}

function createHeaders({
    body,
    headers,
    token,
}: Pick<ApiRequestOptions, "body" | "headers" | "token">) {
    const requestHeaders = new Headers(headers);

    requestHeaders.set("Accept", "application/json");

    if (token) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    if (body && !(body instanceof FormData)) {
        requestHeaders.set("Content-Type", "application/json");
    }

    return requestHeaders;
}

function createRequestBody(body?: JsonRequestBody | FormData) {
    if (!body) {
        return undefined;
    }

    if (body instanceof FormData) {
        return body;
    }

    return JSON.stringify(body);
}

async function parseResponse(response: Response): Promise<unknown> {
    const responseText = await response.text();

    if (!responseText) {
        return null;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return null;
    }
}

function getErrorMessage(
    response: Response,
    errorResponse: Partial<ApiErrorResponse>,
) {
    if (response.status === 401) {
        return "Your session has expired. Please sign in again.";
    }

    if (response.status === 429) {
        return "Too many requests were made. Please try again shortly.";
    }

    if (response.status >= 500) {
        return "RESTNEST is temporarily unavailable. Please try again later.";
    }

    return errorResponse.message || "The request could not be completed.";
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
    const { body, headers, token, ...requestOptions } = options;

    let response: Response;

    try {
        response = await fetch(createApiUrl(endpoint), {
            ...requestOptions,
            headers: createHeaders({ body, headers, token }),
            body: createRequestBody(body),
        });
    } catch {
        throw new ApiError(
            "Unable to connect to RESTNEST. Check your internet connection and try again.",
            0,
        );
    }

    const responseData = await parseResponse(response);

    if (!response.ok) {
        const errorResponse =
            responseData && typeof responseData === "object"
                ? (responseData as Partial<ApiErrorResponse>)
                : {};

        throw new ApiError(
            getErrorMessage(response, errorResponse),
            response.status,
            errorResponse.errorDetails,
        );
    }

    if (!responseData || typeof responseData !== "object") {
        throw new ApiError(
            "RESTNEST returned an unexpected response.",
            response.status,
        );
    }

    return responseData as ApiSuccessResponse<T>;
}