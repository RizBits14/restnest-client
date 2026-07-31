"use client";

import { useQuery } from "@tanstack/react-query";

import { getSessionUser } from "@/lib/api/auth-client";

export const sessionQueryKey = [
    "auth",
    "session",
] as const;

export function useSession() {
    return useQuery({
        queryKey: sessionQueryKey,
        queryFn: getSessionUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}