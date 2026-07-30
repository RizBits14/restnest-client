import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

const authCookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
};

export async function setAuthToken(token: string) {
    const cookieStore = await cookies();

    cookieStore.set(
        AUTH_COOKIE_NAME,
        token,
        authCookieOptions,
    );
}

export async function getAuthToken() {
    const cookieStore = await cookies();

    return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function clearAuthToken() {
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, "", {
        ...authCookieOptions,
        expires: new Date(0),
    });
}