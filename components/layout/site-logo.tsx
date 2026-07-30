import { House } from "lucide-react";
import Link from "next/link";

export function SiteLogo() {
    return (
        <Link
            href="/"
            aria-label="RESTNEST home"
            className="group inline-flex items-center gap-3"
        >
            <span className="grid size-10 place-items-center rounded-[0.9rem] border border-brand/30 bg-brand text-brand-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                <House
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.9}
                />
            </span>

            <span className="text-lg font-semibold tracking-[-0.04em] text-foreground">
                <span className="text-brand">REST</span>NEST
            </span>
        </Link>
    );
}