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
    LoaderCircle,
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

type ToastVisualStyle = Readonly<{
    iconContainerClassName: string;
    accentClassName: string;
}>;

const toastVisualStyles: Record<string, ToastVisualStyle> = {
    success: {
        iconContainerClassName:
            "bg-success-soft text-success",
        accentClassName: "bg-success",
    },
    error: {
        iconContainerClassName:
            "bg-danger-soft text-danger",
        accentClassName: "bg-danger",
    },
    warning: {
        iconContainerClassName:
            "bg-warning-soft text-warning",
        accentClassName: "bg-warning",
    },
    loading: {
        iconContainerClassName:
            "bg-info-soft text-info",
        accentClassName: "bg-info",
    },
    info: {
        iconContainerClassName:
            "bg-info-soft text-info",
        accentClassName: "bg-info",
    },
};

function getToastVisualStyle(type?: string) {
    if (type && toastVisualStyles[type]) {
        return toastVisualStyles[type];
    }

    return toastVisualStyles.info;
}

type ToastIconProps = Readonly<{
    type?: string;
}>;

function ToastIcon({ type }: ToastIconProps) {
    if (type === "success") {
        return (
            <CheckCircle2
                aria-hidden="true"
                className="size-5"
            />
        );
    }

    if (type === "error") {
        return (
            <AlertCircle
                aria-hidden="true"
                className="size-5"
            />
        );
    }

    if (type === "warning") {
        return (
            <TriangleAlert
                aria-hidden="true"
                className="size-5"
            />
        );
    }

    if (type === "loading") {
        return (
            <LoaderCircle
                aria-hidden="true"
                className="size-5 animate-spin"
            />
        );
    }

    return <Info aria-hidden="true" className="size-5" />;
}

export function AppToaster() {
    return (
        <Toaster toaster={toaster}>
            {(toast) => {
                const visualStyle = getToastVisualStyle(
                    toast.type,
                );

                return (
                    <Toast.Root className="relative flex w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-surface-elevated text-foreground shadow-raised">
                        <span
                            aria-hidden="true"
                            className={`absolute inset-y-0 left-0 w-1 ${visualStyle.accentClassName}`}
                        />

                        <div className="flex min-w-0 flex-1 items-start gap-3 py-4 pl-5 pr-3">
                            <span
                                aria-hidden="true"
                                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${visualStyle.iconContainerClassName}`}
                            >
                                <ToastIcon type={toast.type} />
                            </span>

                            <div className="min-w-0 flex-1">
                                {toast.title && (
                                    <Toast.Title className="text-sm font-bold leading-5 text-foreground">
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
                                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-surface-muted hover:text-foreground"
                            >
                                <X
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Toast.CloseTrigger>
                        </div>
                    </Toast.Root>
                );
            }}
        </Toaster>
    );
}