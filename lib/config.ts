const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
    throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is missing.",
    );
}

export const appConfig = {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
} as const;