"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    CheckCircle2,
    CircleAlert,
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
import { tenantRentalsQueryKey } from "@/lib/api/tenant-rentals-client";
import { createTenantReview } from "@/lib/api/tenant-reviews-client";
import {
    rentalReviewSchema,
    type RentalReviewFormValues,
} from "@/lib/validation/rental-review-schema";
import type {
    RentalReview,
    TenantRentalRequest,
} from "@/types/rental";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
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
        <span
            role="img"
            aria-label={`${rating} out of 5 stars`}
            className="inline-flex items-center gap-1"
        >
            {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= rating;

                return (
                    <Star
                        key={starValue}
                        aria-hidden="true"
                        className={[
                            "size-4",
                            isFilled
                                ? "fill-warning text-warning"
                                : "fill-transparent text-border-strong",
                        ].join(" ")}
                    />
                );
            })}
        </span>
    );
}

type SubmittedReviewProps = Readonly<{
    review: RentalReview;
}>;

function SubmittedReview({
    review,
}: SubmittedReviewProps) {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-success/20 bg-success-soft">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-success/15 px-4 py-4">
                <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success text-success-foreground">
                        <CheckCircle2
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-bold text-foreground">
                            Review submitted
                        </p>

                        <div className="mt-1.5">
                            <ReviewStars rating={review.rating} />
                        </div>
                    </div>
                </div>

                <time
                    dateTime={review.createdAt}
                    className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                    {dateFormatter.format(
                        new Date(review.createdAt),
                    )}
                </time>
            </div>

            <div className="px-4 py-4">
                {review.comment ? (
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                        “{review.comment}”
                    </p>
                ) : (
                    <p className="text-sm italic leading-6 text-muted-foreground">
                        You submitted a rating without a written comment.
                    </p>
                )}
            </div>
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
            queryClient.setQueryData<TenantRentalRequest[]>(
                tenantRentalsQueryKey,
                (currentRentals = []) =>
                    currentRentals.map((currentRental) =>
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
        resolver: zodResolver(rentalReviewSchema),
        defaultValues,
    });

    const selectedRating =
        useWatch({
            control,
            name: "rating",
        }) ?? 0;

    const reviewComment =
        useWatch({
            control,
            name: "comment",
        }) ?? "";

    const isEligible =
        rental.status === "ACTIVE" &&
        rental.payment?.status === "COMPLETED" &&
        !rental.review;

    const isPending =
        isSubmitting || reviewMutation.isPending;

    const ratingLabelId =
        `review-rating-label-${rental.id}`;

    const ratingErrorId =
        `review-rating-error-${rental.id}`;

    const commentId =
        `review-comment-${rental.id}`;

    const commentHelpId =
        `review-comment-help-${rental.id}`;

    const commentErrorId =
        `review-comment-error-${rental.id}`;

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
            <SubmittedReview review={rental.review} />
        );
    }

    if (!isEligible) {
        return null;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-4 overflow-hidden rounded-2xl border border-warning/20 bg-warning-soft"
        >
            <div className="border-b border-warning/15 px-4 py-4">
                <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning text-warning-foreground">
                        <MessageSquareText
                            aria-hidden="true"
                            className="size-5"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-bold text-foreground">
                            Share your experience
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Your review will appear on this property’s
                            public details page.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {errors.root && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm leading-6 text-danger"
                    >
                        <CircleAlert
                            aria-hidden="true"
                            className="mt-1 size-4 shrink-0"
                        />

                        <p>{errors.root.message}</p>
                    </div>
                )}

                <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p
                            id={ratingLabelId}
                            className="text-sm font-bold text-foreground"
                        >
                            Your rating
                        </p>

                        <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-warning">
                            {selectedRating > 0
                                ? `${selectedRating} / 5`
                                : "Not selected"}
                        </span>
                    </div>

                    <input
                        type="hidden"
                        {...register("rating", {
                            valueAsNumber: true,
                        })}
                    />

                    <div
                        role="radiogroup"
                        aria-labelledby={ratingLabelId}
                        aria-describedby={
                            errors.rating
                                ? ratingErrorId
                                : undefined
                        }
                        className="mt-3 flex items-center gap-1"
                    >
                        {Array.from({ length: 5 }, (_, index) => {
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
                                    aria-label={`${rating} ${rating === 1 ? "star" : "stars"
                                        }`}
                                    disabled={isPending}
                                    onClick={() => {
                                        setValue("rating", rating, {
                                            shouldDirty: true,
                                            shouldValidate: true,
                                        });
                                    }}
                                    className={[
                                        "grid size-11 place-items-center rounded-xl transition-colors duration-200",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-warning-soft",
                                        "disabled:cursor-wait disabled:opacity-60",
                                        isSelected
                                            ? "bg-surface text-warning"
                                            : "text-muted-foreground hover:bg-surface hover:text-warning",
                                    ].join(" ")}
                                >
                                    <Star
                                        aria-hidden="true"
                                        className={[
                                            "size-6",
                                            isSelected
                                                ? "fill-warning text-warning"
                                                : "fill-transparent",
                                        ].join(" ")}
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {errors.rating && (
                        <p
                            id={ratingErrorId}
                            role="alert"
                            className="mt-2 text-sm font-medium text-danger"
                        >
                            {errors.rating.message}
                        </p>
                    )}
                </div>

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                            htmlFor={commentId}
                            className="text-sm font-bold text-foreground"
                        >
                            Written review
                        </label>

                        <span className="text-xs font-medium text-muted-foreground">
                            Optional
                        </span>
                    </div>

                    <textarea
                        id={commentId}
                        rows={4}
                        maxLength={1_000}
                        placeholder="What did you like or dislike about this property?"
                        disabled={isPending}
                        aria-invalid={Boolean(errors.comment)}
                        aria-describedby={
                            errors.comment
                                ? commentErrorId
                                : commentHelpId
                        }
                        {...register("comment")}
                        className={[
                            "min-h-28 w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm leading-6 text-foreground outline-none",
                            "transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70",
                            "hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10",
                            "disabled:cursor-wait disabled:opacity-60",
                            errors.comment
                                ? "border-danger focus:border-danger focus:ring-danger/10"
                                : "border-border",
                        ].join(" ")}
                    />

                    {errors.comment ? (
                        <p
                            id={commentErrorId}
                            role="alert"
                            className="mt-2 text-sm font-medium text-danger"
                        >
                            {errors.comment.message}
                        </p>
                    ) : (
                        <div
                            id={commentHelpId}
                            className="mt-2 flex items-center justify-between gap-3 text-xs text-muted-foreground"
                        >
                            <span>
                                Keep your feedback clear and respectful.
                            </span>

                            <span className="shrink-0 font-semibold">
                                {reviewComment.length}/1000
                            </span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
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
                            Publish review
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}