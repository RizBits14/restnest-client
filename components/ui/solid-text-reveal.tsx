"use client";

import {
    useEffect,
    useState,
    type ElementType,
} from "react";

type SupportedElement = Extract<
    ElementType,
    "h1" | "h2" | "h3" | "p" | "div"
>;

type SolidTextRevealProps = Readonly<{
    lines: readonly string[];
    as?: SupportedElement;
    id?: string;
    className?: string;
    accentLineIndex?: number;
    revealTone?: "brand" | "accent";
    delayStepMs?: number;
}>;

const revealToneClasses = {
    brand: "bg-brand",
    accent: "bg-accent",
} as const;

export function SolidTextReveal({
    lines,
    as: Component = "div",
    id,
    className = "",
    accentLineIndex,
    revealTone = "accent",
    delayStepMs = 120,
}: SolidTextRevealProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(() => {
            setIsRevealed(true);
        });

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    if (lines.length === 0) {
        return null;
    }

    const accessibleText = lines.join(" ");

    return (
        <Component
            id={id}
            aria-label={accessibleText}
            className={className}
        >
            {lines.map((line, index) => {
                const textDelay = index * delayStepMs + 100;
                const barDelay = index * delayStepMs;
                const isAccentLine = index === accentLineIndex;

                return (
                    <span
                        key={`${line}-${index}`}
                        aria-hidden="true"
                        className="relative block overflow-hidden pb-[0.08em]"
                    >
                        <span
                            className={[
                                "block transition-[transform,opacity] duration-700 ease-out",
                                "motion-reduce:transition-none",
                                isAccentLine ? "text-brand" : "",
                                isRevealed
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-[115%] opacity-0",
                            ].join(" ")}
                            style={{
                                transitionDelay: `${textDelay}ms`,
                            }}
                        >
                            {line}
                        </span>

                        <span
                            aria-hidden="true"
                            className={[
                                "pointer-events-none absolute inset-y-[0.08em] left-0 w-full",
                                "transition-transform duration-700 ease-out",
                                "motion-reduce:hidden motion-reduce:transition-none",
                                revealToneClasses[revealTone],
                                isRevealed
                                    ? "translate-x-[105%]"
                                    : "-translate-x-[105%]",
                            ].join(" ")}
                            style={{
                                transitionDelay: `${barDelay}ms`,
                            }}
                        />
                    </span>
                );
            })}
        </Component>
    );
}