import type { AuthUser } from "@/types/auth";

type AuthClientResponse = {
    success: boolean;
    message: string;
    data?: {
        user: AuthUser;
    };
};

async function parseAuthResponse(response: Response) {
    try {
        return (await response.json()) as AuthClientResponse;
    } catch {
        return null;
    }
}

export async function getSessionUser(): Promise<AuthUser | null> {
    let response: Response;

    try {
        response = await fetch("/api/auth/session", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });
    } catch {
        throw new Error(
            "Unable to verify your session. Check your connection and try again.",
        );
    }

    const result = await parseAuthResponse(response);

    if (response.status === 401) {
        return null;
    }

    if (!response.ok || !result?.success || !result.data?.user) {
        throw new Error(
            result?.message || "Your session could not be verified.",
        );
    }

    return result.data.user;
}

export async function logoutUser() {
    let response: Response;

    try {
        response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch {
        throw new Error(
            "Unable to sign out. Check your connection and try again.",
        );
    }

    const result = await parseAuthResponse(response);

    if (!response.ok || !result?.success) {
        throw new Error(
            result?.message || "Unable to sign out. Please try again.",
        );
    }

    return result.message;
}