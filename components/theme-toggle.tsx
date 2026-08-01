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
    const accessibleLabel = isDarkTheme
        ? "Switch to light theme"
        : "Switch to dark theme";

    function handleThemeChange() {
        setTheme(isDarkTheme ? "light" : "dark");
    }

    return (
        <button
            type="button"
            onClick={handleThemeChange}
            disabled={!mounted}
            aria-label={accessibleLabel}
            title={accessibleLabel}
            className="group grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors duration-200 hover:border-brand/35 hover:bg-brand-soft hover:text-brand disabled:cursor-wait disabled:opacity-60"
        >
            <span
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-lg bg-surface-muted transition-colors duration-200 group-hover:bg-surface"
            >
                {isDarkTheme ? (
                    <Sun className="size-[1.05rem]" strokeWidth={2} />
                ) : (
                    <Moon className="size-[1.05rem]" strokeWidth={2} />
                )}
            </span>
        </button>
    );
}