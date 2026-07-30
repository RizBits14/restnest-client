"use client";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { AppToaster } from "@/components/ui/app-toaster";

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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme={false}
            disableTransitionOnChange
            storageKey="restnest-theme"
        >
            <QueryClientProvider client={queryClient}>
                {children}
                <AppToaster />
            </QueryClientProvider>
        </ThemeProvider>
    );
}