import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
    const accessToken =
        request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!accessToken) {
        const loginUrl = new URL(
            "/auth/login",
            request.url,
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};