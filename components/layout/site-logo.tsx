import { House } from "lucide-react";
import Link from "next/link";

export function SiteLogo() {
    return (
        <Link
            href="/"
            aria-label="RESTNEST home"
            className="group inline-flex min-w-0 items-center gap-2.5 rounded-xl"
        >
            <span
                aria-hidden="true"
                className="relative grid size-10 shrink-0 place-items-center rounded-[0.95rem] border border-brand/25 bg-brand-soft text-brand transition-colors duration-200 group-hover:border-brand/40 group-hover:bg-surface-muted"
            >
                <House className="size-5" strokeWidth={2} />

                <span className="absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-accent ring-2 ring-brand-soft transition-colors duration-200 group-hover:ring-surface-muted" />
            </span>

            <span className="min-w-0 leading-none">
                <span className="block text-[1.05rem] font-bold tracking-[-0.045em] text-foreground sm:text-lg">
                    REST<span className="text-brand">NEST</span>
                </span>

                <span className="mt-1 hidden text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">
                    Find your place
                </span>
            </span>
        </Link>
    );
}