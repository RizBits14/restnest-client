"use client";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

type AppProvidersProps = Readonly<{
    children: React.ReactNode;
}>;

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}

export function AppProviders({ children }: AppProvidersProps) {
    const [queryClient] = useState(createQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            {children}

            <Toaster
                position="top-right"
                duration={4_000}
                visibleToasts={4}
                closeButton
                toastOptions={{
                    style: {
                        background: "var(--surface)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 16px 40px rgba(20, 30, 24, 0.12)",
                    },
                }}
            />
        </QueryClientProvider>
    );
}