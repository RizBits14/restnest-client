import "server-only";

import {
    apiRequest,
    ApiError,
    type ApiRequestOptions,
} from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/auth-cookie";

type AuthenticatedApiRequestOptions = Omit<
    ApiRequestOptions,
    "token"
>;

export async function authenticatedApiRequest<T>(
    endpoint: string,
    options: AuthenticatedApiRequestOptions = {},
) {
    const token = await getAuthToken();

    if (!token) {
        throw new ApiError(
            "You are not signed in.",
            401,
        );
    }

    return apiRequest<T>(endpoint, {
        ...options,
        token,
        cache: "no-store",
    });
}