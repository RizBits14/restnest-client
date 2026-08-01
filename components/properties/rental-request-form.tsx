"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    CalendarDays,
    CircleAlert,
    Clock3,
    Info,
    LoaderCircle,
    LockKeyhole,
    LogIn,
    Send,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { toaster } from "@/components/ui/app-toaster";
import { useSession } from "@/hooks/use-session";
import {
    createTenantRentalRequest,
    getTenantRentals,
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";
import {
    rentalRequestSchema,
    type RentalRequestFormValues,
} from "@/lib/validation/rental-request-schema";
import type { PropertyStatus } from "@/types/property";
import type { RentalStatus } from "@/types/rental";

const defaultValues: RentalRequestFormValues = {
    moveInDate: "",
    duration: "",
    message: "",
};

const blockingRentalStatuses = new Set<RentalStatus>([
    "PENDING",
    "APPROVED",
    "ACTIVE",
]);

const rentalStatusLabels: Partial<
    Record<RentalStatus, string>
> = {
    PENDING: "pending",
    APPROVED: "approved",
    ACTIVE: "active",
};

const inputClassName =
    "w-full rounded-xl border border-border bg-background text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

const errorInputClassName =
    "border-danger focus:border-danger focus:ring-danger/10";

type RentalRequestFormProps = Readonly<{
    propertyId: string;
    propertyTitle: string;
    propertyStatus: PropertyStatus;
}>;

type StatusNoticeProps = Readonly<{
    type?: "neutral" | "info" | "error";
    children: React.ReactNode;
}>;

function StatusNotice({
    type = "neutral",
    children,
}: StatusNoticeProps) {
    const styles = {
        neutral:
            "border-border bg-surface-subtle text-muted-foreground",
        info: "border-info/20 bg-info-soft text-foreground",
        error: "border-danger/20 bg-danger-soft text-danger",
    };

    const Icon = type === "error" ? CircleAlert : Info;

    return (
        <div
            role={type === "error" ? "alert" : undefined}
            className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-sm leading-6 ${styles[type]}`}
        >
            <Icon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
            />

            <div className="min-w-0">{children}</div>
        </div>
    );
}

export function RentalRequestForm({
    propertyId,
    propertyTitle,
    propertyStatus,
}: RentalRequestFormProps) {
    const queryClient = useQueryClient();

    const {
        data: sessionUser,
        isLoading: isSessionLoading,
    } = useSession();

    const isTenant = sessionUser?.role === "TENANT";

    const {
        data: tenantRentals = [],
        error: tenantRentalsError,
        isLoading: isTenantRentalsLoading,
    } = useQuery({
        queryKey: tenantRentalsQueryKey,
        queryFn: getTenantRentals,
        enabled: isTenant,
        retry: false,
    });

    const blockingRentalRequest = tenantRentals.find(
        (rentalRequest) =>
            rentalRequest.propertyId === propertyId &&
            blockingRentalStatuses.has(rentalRequest.status),
    );

    const rentalRequestMutation = useMutation({
        mutationFn: createTenantRentalRequest,
    });

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<RentalRequestFormValues>({
        resolver: zodResolver(rentalRequestSchema),
        defaultValues,
    });

    async function onSubmit(
        values: RentalRequestFormValues,
    ) {
        if (
            !isTenant ||
            isTenantRentalsLoading ||
            tenantRentalsError ||
            blockingRentalRequest ||
            propertyStatus !== "AVAILABLE"
        ) {
            return;
        }

        clearErrors("root");

        try {
            await rentalRequestMutation.mutateAsync({
                propertyId,
                moveInDate: new Date(
                    `${values.moveInDate}T00:00:00`,
                ).toISOString(),
                duration: Number(values.duration),
                ...(values.message.trim()
                    ? {
                        message: values.message.trim(),
                    }
                    : {}),
            });

            await queryClient.invalidateQueries({
                queryKey: tenantRentalsQueryKey,
            });

            toaster.success({
                title: "Rental request submitted",
                description: `Your request for ${propertyTitle} was sent to the landlord.`,
            });

            reset();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "The rental request could not be submitted.";

            setError("root", {
                type: "server",
                message,
            });

            toaster.error({
                title: "Request submission failed",
                description: message,
            });
        }
    }

    const isUnavailable =
        propertyStatus !== "AVAILABLE";

    const isPending =
        isSubmitting || rentalRequestMutation.isPending;

    const blockingStatusLabel = blockingRentalRequest
        ? rentalStatusLabels[blockingRentalRequest.status] ??
        "existing"
        : "existing";

    return (
        <section
            aria-labelledby="rental-request-title"
            className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft"
        >
            <div className="border-b border-border bg-surface-subtle p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                        <Send
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                            Rental request
                        </p>

                        <h2
                            id="rental-request-title"
                            className="mt-1 text-xl font-bold tracking-[-0.035em] text-foreground"
                        >
                            Request this property
                        </h2>
                    </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Submit your preferred move-in date and rental
                    duration for the landlord to review.
                </p>
            </div>

            <div className="p-5 sm:p-6">
                {isSessionLoading ? (
                    <div
                        role="status"
                        className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-4 text-sm text-muted-foreground"
                    >
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin text-brand"
                        />
                        Checking your account...
                    </div>
                ) : !sessionUser ? (
                    <div className="space-y-4">
                        <StatusNotice type="info">
                            Sign in with a tenant account to submit a
                            rental request for this property.
                        </StatusNotice>

                        <Link
                            href="/auth/login"
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active"
                        >
                            <LogIn
                                aria-hidden="true"
                                className="size-4"
                            />
                            Sign in to continue
                        </Link>
                    </div>
                ) : !isTenant ? (
                    <StatusNotice>
                        Only tenant accounts can submit rental requests.
                        Your current account can still browse property
                        information.
                    </StatusNotice>
                ) : isTenantRentalsLoading ? (
                    <div
                        role="status"
                        className="flex items-center gap-3 rounded-xl border border-border bg-surface-subtle px-4 py-4 text-sm text-muted-foreground"
                    >
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin text-brand"
                        />
                        Checking your existing requests...
                    </div>
                ) : tenantRentalsError ? (
                    <StatusNotice type="error">
                        Your existing rental requests could not be
                        checked. Refresh the page and try again.
                    </StatusNotice>
                ) : blockingRentalRequest ? (
                    <div className="space-y-4">
                        <StatusNotice type="info">
                            You already have a{" "}
                            <strong className="font-bold">
                                {blockingStatusLabel}
                            </strong>{" "}
                            rental request for this property. Another
                            request cannot be submitted at this time.
                        </StatusNotice>

                        <button
                            type="button"
                            disabled
                            className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-surface-muted px-5 text-sm font-bold text-muted-foreground opacity-70"
                        >
                            <LockKeyhole
                                aria-hidden="true"
                                className="size-4"
                            />
                            Request already exists
                        </button>
                    </div>
                ) : isUnavailable ? (
                    <StatusNotice>
                        This property is not currently accepting rental
                        requests.
                    </StatusNotice>
                ) : (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="space-y-5"
                    >
                        {errors.root && (
                            <StatusNotice type="error">
                                {errors.root.message}
                            </StatusNotice>
                        )}

                        <div>
                            <label
                                htmlFor="rental-move-in-date"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Move-in date
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                                />

                                <input
                                    id="rental-move-in-date"
                                    type="date"
                                    aria-invalid={Boolean(
                                        errors.moveInDate,
                                    )}
                                    aria-describedby={
                                        errors.moveInDate
                                            ? "rental-move-in-date-error"
                                            : undefined
                                    }
                                    {...register("moveInDate")}
                                    className={[
                                        inputClassName,
                                        "h-12 pl-10 pr-4",
                                        errors.moveInDate
                                            ? errorInputClassName
                                            : "",
                                    ].join(" ")}
                                />
                            </div>

                            {errors.moveInDate && (
                                <p
                                    id="rental-move-in-date-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.moveInDate.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="rental-duration"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Duration in months
                            </label>

                            <div className="relative">
                                <Clock3
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                                />

                                <input
                                    id="rental-duration"
                                    type="number"
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                    placeholder="12"
                                    aria-invalid={Boolean(
                                        errors.duration,
                                    )}
                                    aria-describedby={
                                        errors.duration
                                            ? "rental-duration-error"
                                            : undefined
                                    }
                                    {...register("duration")}
                                    className={[
                                        inputClassName,
                                        "h-12 pl-10 pr-4",
                                        errors.duration
                                            ? errorInputClassName
                                            : "",
                                    ].join(" ")}
                                />
                            </div>

                            {errors.duration && (
                                <p
                                    id="rental-duration-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.duration.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="rental-message"
                                    className="text-sm font-bold text-foreground"
                                >
                                    Message
                                </label>

                                <span className="text-xs font-medium text-muted-foreground">
                                    Optional
                                </span>
                            </div>

                            <textarea
                                id="rental-message"
                                rows={5}
                                maxLength={1_000}
                                placeholder="Share any useful details with the landlord."
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby={
                                    errors.message
                                        ? "rental-message-error"
                                        : "rental-message-help"
                                }
                                {...register("message")}
                                className={[
                                    inputClassName,
                                    "min-h-32 resize-y px-4 py-3 leading-6",
                                    errors.message
                                        ? errorInputClassName
                                        : "",
                                ].join(" ")}
                            />

                            {errors.message ? (
                                <p
                                    id="rental-message-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    {errors.message.message}
                                </p>
                            ) : (
                                <p
                                    id="rental-message-help"
                                    className="mt-2 text-xs leading-5 text-muted-foreground"
                                >
                                    Include questions or details that may help
                                    the landlord review your request.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 animate-spin"
                                    />
                                    Submitting request...
                                </>
                            ) : (
                                <>
                                    <Send
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    Submit rental request
                                </>
                            )}
                        </button>

                        <div className="flex items-start gap-3 rounded-xl bg-success-soft px-4 py-3">
                            <ShieldCheck
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-success"
                            />

                            <p className="text-xs leading-5 text-muted-foreground">
                                Submitting a request does not charge you.
                                Payment becomes available only after landlord
                                approval.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}