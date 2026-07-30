"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => { };

function useMounted() {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
}

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();

    const isDarkTheme = mounted && resolvedTheme === "dark";

    function handleThemeChange() {
        setTheme(isDarkTheme ? "light" : "dark");
    }

    return (
        <button
            type="button"
            onClick={handleThemeChange}
            disabled={!mounted}
            aria-label={
                isDarkTheme
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            }
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-surface-muted disabled:cursor-wait disabled:opacity-60"
        >
            {isDarkTheme ? (
                <Sun aria-hidden="true" className="size-[1.1rem]" />
            ) : (
                <Moon aria-hidden="true" className="size-[1.1rem]" />
            )}
        </button>
    );
}