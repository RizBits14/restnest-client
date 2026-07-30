export function PropertyCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="overflow-hidden rounded-[1.75rem] border border-border bg-surface"
        >
            <div className="aspect-[16/10] animate-pulse bg-surface-muted" />

            <div className="space-y-4 p-5">
                <div className="h-4 w-24 animate-pulse rounded-full bg-surface-muted" />

                <div className="h-6 w-3/4 animate-pulse rounded-lg bg-surface-muted" />

                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-surface-muted" />

                <div className="flex gap-3 border-t border-border pt-4">
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="h-4 w-16 animate-pulse rounded-lg bg-surface-muted" />
                </div>
            </div>
        </div>
    );
}