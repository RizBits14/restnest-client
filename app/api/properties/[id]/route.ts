import { NextResponse } from "next/server";

type PropertyRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    _request: Request,
    context: PropertyRouteContext,
) {
    const { id } = await context.params;

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
            /\/+$/,
            "",
        );

    if (!apiBaseUrl) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "The backend API URL is not configured.",
            },
            {
                status: 500,
            },
        );
    }

    try {
        const response = await fetch(
            `${apiBaseUrl}/properties/${encodeURIComponent(id)}`,
            {
                method: "GET",
                cache: "no-store",
            },
        );

        const result = await response
            .json()
            .catch(() => null);

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The property service returned an invalid response.",
                },
                {
                    status: 502,
                },
            );
        }

        return NextResponse.json(result, {
            status: response.status,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to connect to the property service.",
            },
            {
                status: 503,
            },
        );
    }
}