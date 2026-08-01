"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type ImageAccordionItem = Readonly<{
    src: string;
    alt: string;
    title: string;
    description: string;
    label?: string;
}>;

type ImageAccordionProps = Readonly<{
    items: readonly ImageAccordionItem[];
    defaultActiveIndex?: number;
    ariaLabel?: string;
}>;

function clampIndex(index: number, itemCount: number) {
    if (itemCount <= 0) {
        return 0;
    }

    return Math.min(Math.max(index, 0), itemCount - 1);
}

export function ImageAccordion({
    items,
    defaultActiveIndex = 0,
    ariaLabel = "Featured property types",
}: ImageAccordionProps) {
    const accordionId = useId();

    const [activeIndex, setActiveIndex] = useState(() =>
        clampIndex(defaultActiveIndex, items.length),
    );

    if (items.length === 0) {
        return null;
    }

    const safeActiveIndex = clampIndex(
        activeIndex,
        items.length,
    );

    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className="flex h-[34rem] w-full flex-col gap-2 overflow-hidden rounded-[2rem] border border-border bg-surface p-2 shadow-raised sm:h-[30rem] sm:flex-row lg:h-[34rem]"
        >
            {items.map((item, index) => {
                const isActive = index === safeActiveIndex;
                const panelId = `${accordionId}-panel-${index}`;

                return (
                    <button
                        key={`${item.src}-${item.title}`}
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        aria-label={`Show ${item.title}`}
                        onClick={() => setActiveIndex(index)}
                        onFocus={() => setActiveIndex(index)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={[
                            "group relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-[1.5rem] text-left ring-1 ring-inset",
                            "transition-[flex-grow,box-shadow] duration-500 ease-out",
                            "focus-visible:z-10",
                            isActive
                                ? "ring-brand/40"
                                : "ring-border hover:ring-border-strong",
                        ].join(" ")}
                        style={{
                            flexGrow: isActive ? 3.4 : 1,
                        }}
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            priority={index === defaultActiveIndex}
                            sizes={
                                isActive
                                    ? "(max-width: 639px) 100vw, 55vw"
                                    : "(max-width: 639px) 100vw, 20vw"
                            }
                            className={[
                                "object-cover transition-transform duration-700 ease-out",
                                isActive
                                    ? "scale-100"
                                    : "scale-[1.04] group-hover:scale-100",
                            ].join(" ")}
                        />

                        <span
                            aria-hidden="true"
                            className={[
                                "absolute inset-0 bg-overlay transition-opacity duration-300",
                                isActive ? "opacity-10" : "opacity-25",
                            ].join(" ")}
                        />

                        {item.label && (
                            <span className="absolute left-3 top-3 rounded-full border border-border/80 bg-surface-elevated/95 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-brand shadow-soft backdrop-blur-sm">
                                {item.label}
                            </span>
                        )}

                        <div
                            id={panelId}
                            className={[
                                "absolute bottom-3 transition-all duration-300",
                                isActive
                                    ? "inset-x-3 rounded-2xl bg-surface-elevated/95 p-4 shadow-soft backdrop-blur-sm sm:p-5"
                                    : "right-3",
                            ].join(" ")}
                        >
                            <div
                                className={[
                                    "flex items-end gap-4",
                                    isActive ? "justify-between" : "justify-end",
                                ].join(" ")}
                            >
                                {isActive && (
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold tracking-[-0.025em] text-foreground sm:text-xl">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                )}

                                <span
                                    aria-hidden="true"
                                    className={[
                                        "shrink-0 rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] shadow-soft backdrop-blur-sm",
                                        isActive
                                            ? "bg-brand-soft text-brand"
                                            : "bg-surface-elevated/90 text-foreground",
                                    ].join(" ")}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}