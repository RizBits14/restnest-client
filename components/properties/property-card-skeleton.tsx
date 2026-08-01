export function PropertyCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="relative aspect-[16/10] animate-pulse bg-surface-muted">
                <div className="absolute left-4 top-4 h-7 w-24 rounded-full bg-surface-elevated/80" />
                <div className="absolute right-4 top-4 h-7 w-20 rounded-full bg-surface-elevated/80" />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-5 w-4/5 animate-pulse rounded-lg bg-surface-muted" />
                        <div className="h-5 w-3/5 animate-pulse rounded-lg bg-surface-muted" />

                        <div className="flex items-center gap-2">
                            <div className="size-4 shrink-0 animate-pulse rounded-md bg-surface-muted" />
                            <div className="h-4 w-2/3 animate-pulse rounded-lg bg-surface-muted" />
                        </div>
                    </div>

                    <div className="shrink-0 space-y-2 text-right">
                        <div className="ml-auto h-5 w-20 animate-pulse rounded-lg bg-surface-muted" />
                        <div className="ml-auto h-3 w-10 animate-pulse rounded-md bg-surface-muted" />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Array.from({ length: 3 }, (_, index) => (
                        <div
                            key={index}
                            className={[
                                "flex h-10 animate-pulse items-center gap-2 rounded-xl bg-surface-subtle px-3",
                                index === 2
                                    ? "col-span-2 sm:col-span-1"
                                    : "",
                            ].join(" ")}
                        >
                            <div className="size-4 rounded-md bg-surface-muted" />
                            <div className="h-3 flex-1 rounded-md bg-surface-muted" />
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-border pt-4">
                        <div className="h-4 w-24 animate-pulse rounded-lg bg-surface-muted" />

                        <div className="size-10 animate-pulse rounded-xl bg-surface-muted" />
                    </div>
                </div>
            </div>
        </div>
    );
}