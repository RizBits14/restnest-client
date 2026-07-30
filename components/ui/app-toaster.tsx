"use client";

import {
    Toast,
    Toaster,
    createToaster,
} from "@ark-ui/react/toast";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";

export const toaster = createToaster({
    placement: "top-end",
    overlap: true,
    gap: 12,
    max: 4,
    duration: 4_000,
    offsets: {
        top: "1rem",
        right: "1rem",
        bottom: "1rem",
        left: "1rem",
    },
});

type ToastIconProps = Readonly<{
    type?: string;
}>;

function ToastIcon({ type }: ToastIconProps) {
    if (type === "success") {
        return <CheckCircle2 aria-hidden="true" className="size-5" />;
    }

    if (type === "error") {
        return <AlertCircle aria-hidden="true" className="size-5" />;
    }

    if (type === "warning") {
        return <TriangleAlert aria-hidden="true" className="size-5" />;
    }

    return <Info aria-hidden="true" className="size-5" />;
}

export function AppToaster() {
    return (
        <Toaster toaster={toaster}>
            {(toast) => (
                <Toast.Root className="flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-foreground shadow-[0_16px_48px_rgba(20,30,24,0.16)]">
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                        <ToastIcon type={toast.type} />
                    </span>

                    <div className="min-w-0 flex-1">
                        {toast.title && (
                            <Toast.Title className="text-sm font-semibold text-foreground">
                                {toast.title}
                            </Toast.Title>
                        )}

                        {toast.description && (
                            <Toast.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                                {toast.description}
                            </Toast.Description>
                        )}
                    </div>

                    <Toast.CloseTrigger
                        aria-label="Dismiss notification"
                        className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                    >
                        <X aria-hidden="true" className="size-4" />
                    </Toast.CloseTrigger>
                </Toast.Root>
            )}
        </Toaster>
    );
}