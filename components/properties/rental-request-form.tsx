"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    CalendarDays,
    Clock3,
    LoaderCircle,
    LockKeyhole,
    Send,
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

type RentalRequestFormProps = Readonly<{
    propertyId: string;
    propertyTitle: string;
    propertyStatus: PropertyStatus;
}>;

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

    const isTenant =
        sessionUser?.role === "TENANT";

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

    const blockingRentalRequest =
        tenantRentals.find(
            (rentalRequest) =>
                rentalRequest.propertyId === propertyId &&
                blockingRentalStatuses.has(
                    rentalRequest.status,
                ),
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
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RentalRequestFormValues>({
        resolver: zodResolver(
            rentalRequestSchema,
        ),
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
        isSubmitting ||
        rentalRequestMutation.isPending;

    const blockingStatusLabel =
        blockingRentalRequest
            ? rentalStatusLabels[
            blockingRentalRequest.status
            ] ?? "existing"
            : "existing";

    return (
        <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                Rental request
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground">
                Request this property
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Submit your preferred move-in date and rental
                duration for the landlord to review.
            </p>

            {isSessionLoading ? (
                <div
                    role="status"
                    className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm text-muted-foreground"
                >
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin text-brand"
                    />
                    Checking your account...
                </div>
            ) : !sessionUser ? (
                <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm leading-6 text-muted-foreground">
                        Sign in with a tenant account to submit a
                        rental request.
                    </div>

                    <Link
                        href="/auth/login"
                        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                        Sign in to continue
                    </Link>
                </div>
            ) : !isTenant ? (
                <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm leading-6 text-muted-foreground">
                    Only tenant accounts can submit rental
                    requests.
                </div>
            ) : isTenantRentalsLoading ? (
                <div
                    role="status"
                    className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm text-muted-foreground"
                >
                    <LoaderCircle
                        aria-hidden="true"
                        className="size-4 animate-spin text-brand"
                    />
                    Checking your existing requests...
                </div>
            ) : tenantRentalsError ? (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
                >
                    Your existing rental requests could not be
                    checked. Refresh the page and try again.
                </div>
            ) : blockingRentalRequest ? (
                <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-brand/25 bg-surface-muted px-4 py-4 text-sm leading-6 text-muted-foreground">
                        You already have a {blockingStatusLabel}{" "}
                        rental request for this property. Another
                        request cannot be submitted at this time.
                    </div>

                    <button
                        type="button"
                        disabled
                        className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-surface-muted px-5 text-sm font-semibold text-muted-foreground opacity-70"
                    >
                        <LockKeyhole
                            aria-hidden="true"
                            className="size-4"
                        />
                        Request already exists
                    </button>
                </div>
            ) : isUnavailable ? (
                <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-4 text-sm leading-6 text-muted-foreground">
                    This property is not currently accepting
                    rental requests.
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="mt-6 space-y-5"
                >
                    {errors.root && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
                        >
                            {errors.root.message}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="rental-move-in-date"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Move-in date
                        </label>

                        <div className="relative">
                            <CalendarDays
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="rental-move-in-date"
                                type="date"
                                aria-invalid={Boolean(
                                    errors.moveInDate,
                                )}
                                {...register("moveInDate")}
                                className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors focus:border-focus"
                            />
                        </div>

                        {errors.moveInDate && (
                            <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                {errors.moveInDate.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="rental-duration"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Duration in months
                        </label>

                        <div className="relative">
                            <Clock3
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
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
                                {...register("duration")}
                                className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />
                        </div>

                        {errors.duration && (
                            <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                {errors.duration.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="rental-message"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Message{" "}
                            <span className="text-muted-foreground">
                                (optional)
                            </span>
                        </label>

                        <textarea
                            id="rental-message"
                            rows={5}
                            placeholder="Share any useful details with the landlord."
                            aria-invalid={Boolean(
                                errors.message,
                            )}
                            {...register("message")}
                            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />

                        {errors.message && (
                            <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
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
                </form>
            )}
        </section>
    );
}