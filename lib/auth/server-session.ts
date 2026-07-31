import "server-only";

import { redirect } from "next/navigation";

import {
    apiRequest,
    ApiError,
} from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/auth-cookie";
import { getDashboardPath } from "@/lib/auth/get-dashboard-path";
import type {
    AuthUser,
    UserRole,
} from "@/types/auth";

export async function getServerSessionUser() {
    const token = await getAuthToken();

    if (!token) {
        return null;
    }

    try {
        const response = await apiRequest<AuthUser>(
            "/auth/me",
            {
                method: "GET",
                token,
                cache: "no-store",
            },
        );

        return response.data ?? null;
    } catch (error) {
        if (
            error instanceof ApiError &&
            [401, 403, 404].includes(error.status)
        ) {
            return null;
        }

        throw error;
    }
}

export async function requireAuthenticatedUser() {
    const user = await getServerSessionUser();

    if (!user) {
        redirect("/auth/login");
    }

    return user;
}

export async function requireUserRole(
    requiredRole: UserRole,
) {
    const user = await requireAuthenticatedUser();

    if (user.role !== requiredRole) {
        redirect(getDashboardPath(user.role));
    }

    return user;
}