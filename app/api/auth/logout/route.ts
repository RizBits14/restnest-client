import { NextResponse } from "next/server";

import { clearAuthToken } from "@/lib/auth/auth-cookie";

export async function POST() {
    await clearAuthToken();

    return NextResponse.json({
        success: true,
        message: "You have been signed out successfully.",
    });
}