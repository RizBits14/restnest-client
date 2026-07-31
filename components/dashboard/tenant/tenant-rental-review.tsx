"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    CircleCheck,
    LoaderCircle,
    MessageSquareText,
    Send,
    Star,
} from "lucide-react";
import {
    useForm,
    useWatch,
} from "react-hook-form";

import { toaster } from "@/components/ui/app-toaster";
import { propertyDetailsQueryKey } from "@/lib/api/property-details-client";
import {
    tenantRentalsQueryKey,
} from "@/lib/api/tenant-rentals-client";
import { createTenantReview } from "@/lib/api/tenant-reviews-client";
import {
    rentalReviewSchema,
    type RentalReviewFormValues,
} from "@/lib/validation/rental-review-schema";
import type {
    RentalReview,
    TenantRentalRequest,
} from "@/types/rental";

const dateFormatter =
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    });

const defaultValues: RentalReviewFormValues = {
    rating: 0,
    comment: "",
};

type ReviewStarsProps = Readonly<{
    rating: number;
}>;

function ReviewStars({
    rating,
}: ReviewStarsProps) {
    return (
        <div
            aria-label={`${rating} out of 5 stars`}
            className="flex items-center gap-1"
        >
            {Array.from(
                { length: 5 },
                (_, index) => {
                    const starValue = index + 1;

                    return (
                        <Star
                            key={starValue}
                            aria-hidden="true"
                            className={
                                starValue <= rating
                                    ? "size-4 fill-current text-brand"
                                    : "size-4 text-muted-foreground/40"
                            }
                        />
                    );
                },
            )}
        </div>
    );
}

type SubmittedReviewProps = Readonly<{
    review: RentalReview;
}>;

function SubmittedReview({
    review,
}: SubmittedReviewProps) {
    return (
        <div className="mt-5 rounded-xl border border-brand/25 bg-surface-muted p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CircleCheck
                            aria-hidden="true"
                            className="size-4 text-brand"
                        />
                        Review submitted
                    </p>

                    <div className="mt-2">
                        <ReviewStars rating={review.rating} />
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    {dateFormatter.format(
                        new Date(review.createdAt),
                    )}
                </p>
            </div>

            {review.comment && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {review.comment}
                </p>
            )}
        </div>
    );
}

type TenantRentalReviewProps = Readonly<{
    rental: TenantRentalRequest;
}>;

export function TenantRentalReview({
    rental,
}: TenantRentalReviewProps) {
    const queryClient = useQueryClient();

    const reviewMutation = useMutation({
        mutationFn: createTenantReview,

        onSuccess: (createdReview) => {
            queryClient.setQueryData<
                TenantRentalRequest[]
            >(
                tenantRentalsQueryKey,
                (currentRentals = []) =>
                    currentRentals.map(
                        (currentRental) =>
                            currentRental.id === rental.id
                                ? {
                                    ...currentRental,
                                    status: "COMPLETED",
                                    review: createdReview,
                                }
                                : currentRental,
                    ),
            );

            void queryClient.invalidateQueries({
                queryKey: propertyDetailsQueryKey(
                    rental.propertyId,
                ),
            });

            toaster.success({
                title: "Review submitted",
                description: `Your review for ${rental.property.title} has been published.`,
            });
        },

        onError: (error) => {
            toaster.error({
                title: "Review submission failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "The review could not be submitted.",
            });
        },
    });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        setError,
        clearErrors,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<RentalReviewFormValues>({
        resolver: zodResolver(
            rentalReviewSchema,
        ),
        defaultValues,
    });

    const selectedRating =
        useWatch({
            control,
            name: "rating",
        }) ?? 0;

    const isEligible =
        rental.status === "ACTIVE" &&
        rental.payment?.status === "COMPLETED" &&
        !rental.review;

    const isPending =
        isSubmitting ||
        reviewMutation.isPending;

    async function onSubmit(
        values: RentalReviewFormValues,
    ) {
        if (!isEligible) {
            return;
        }

        clearErrors("root");

        try {
            await reviewMutation.mutateAsync({
                rentalRequestId: rental.id,
                rating: values.rating,
                ...(values.comment.trim()
                    ? {
                        comment: values.comment.trim(),
                    }
                    : {}),
            });
        } catch (error) {
            setError("root", {
                type: "server",
                message:
                    error instanceof Error
                        ? error.message
                        : "The review could not be submitted.",
            });
        }
    }

    if (rental.review) {
        return (
            <SubmittedReview
                review={rental.review}
            />
        );
    }

    if (!isEligible) {
        return null;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-5 rounded-xl border border-border bg-background p-4"
        >
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MessageSquareText
                    aria-hidden="true"
                    className="size-4 text-brand"
                />
                Leave a review
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Share your experience with this property.
            </p>

            {errors.root && (
                <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
                >
                    {errors.root.message}
                </div>
            )}

            <div className="mt-5">
                <p
                    id={`review-rating-label-${rental.id}`}
                    className="text-sm font-medium text-foreground"
                >
                    Rating
                </p>

                <input
                    type="hidden"
                    {...register("rating", {
                        valueAsNumber: true,
                    })}
                />

                <div
                    role="radiogroup"
                    aria-labelledby={`review-rating-label-${rental.id}`}
                    className="mt-2 flex items-center gap-1"
                >
                    {Array.from(
                        { length: 5 },
                        (_, index) => {
                            const rating = index + 1;
                            const isSelected =
                                selectedRating >= rating;

                            return (
                                <button
                                    key={rating}
                                    type="button"
                                    role="radio"
                                    aria-checked={
                                        selectedRating === rating
                                    }
                                    aria-label={`${rating} ${rating === 1
                                        ? "star"
                                        : "stars"
                                        }`}
                                    onClick={() => {
                                        setValue(
                                            "rating",
                                            rating,
                                            {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            },
                                        );
                                    }}
                                    className="grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                                >
                                    <Star
                                        aria-hidden="true"
                                        className={
                                            isSelected
                                                ? "size-6 fill-current text-brand"
                                                : "size-6"
                                        }
                                    />
                                </button>
                            );
                        },
                    )}
                </div>

                {errors.rating && (
                    <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                        {errors.rating.message}
                    </p>
                )}
            </div>

            <div className="mt-5">
                <label
                    htmlFor={`review-comment-${rental.id}`}
                    className="mb-2 block text-sm font-medium text-foreground"
                >
                    Comment{" "}
                    <span className="text-muted-foreground">
                        (optional)
                    </span>
                </label>

                <textarea
                    id={`review-comment-${rental.id}`}
                    rows={4}
                    placeholder="What did you like or dislike about this property?"
                    aria-invalid={Boolean(
                        errors.comment,
                    )}
                    {...register("comment")}
                    className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                />

                {errors.comment && (
                    <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                        {errors.comment.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? (
                    <>
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin"
                        />
                        Submitting review...
                    </>
                ) : (
                    <>
                        <Send
                            aria-hidden="true"
                            className="size-4"
                        />
                        Submit review
                    </>
                )}
            </button>
        </form>
    );
}