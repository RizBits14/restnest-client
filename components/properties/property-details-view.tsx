"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Bath,
    BedDouble,
    Building2,
    Check,
    LoaderCircle,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    RefreshCw,
    Star,
} from "lucide-react";
import Link from "next/link";

import { PropertyImage } from "@/components/properties/property-image";
import { RentalRequestForm } from "@/components/properties/rental-request-form";
import {
    getPropertyDetails,
    propertyDetailsQueryKey,
} from "@/lib/api/property-details-client";
import type {
    PropertyDetails,
    PropertyStatus,
} from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
});

const statusLabels: Record<PropertyStatus, string> = {
    AVAILABLE: "Available",
    RENTED: "Rented",
    UNAVAILABLE: "Unavailable",
};

const statusClasses: Record<PropertyStatus, string> = {
    AVAILABLE: "bg-success-soft text-success",
    RENTED: "bg-info-soft text-info",
    UNAVAILABLE: "bg-surface-muted text-muted-foreground",
};

type PropertyDetailsViewProps = Readonly<{
    propertyId: string;
}>;

function getValidImages(images: string[]) {
    return images.filter(
        (imageUrl) => imageUrl.trim().length > 0,
    );
}

function getCountLabel(
    count: number,
    singularLabel: string,
) {
    return `${count} ${singularLabel}${count === 1 ? "" : "s"}`;
}

function getLandlordInitial(name: string) {
    const normalizedName = name.trim();

    return normalizedName
        ? normalizedName.charAt(0).toUpperCase()
        : "L";
}

type RatingStarsProps = Readonly<{
    rating: number;
    label: string;
}>;

function RatingStars({
    rating,
    label,
}: RatingStarsProps) {
    const roundedRating = Math.round(rating);

    return (
        <span
            role="img"
            aria-label={label}
            className="inline-flex items-center gap-1"
        >
            {Array.from({ length: 5 }, (_, index) => {
                const isFilled = index < roundedRating;

                return (
                    <Star
                        key={index}
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

function PropertyDetailsSkeleton() {
    return (
        <section className="mx-auto w-full max-w-352 px-4 py-10 sm:px-6 lg:px-8">
            <div className="h-11 w-44 animate-pulse rounded-xl bg-surface-muted" />

            <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="aspect-video animate-pulse rounded-4xl bg-surface-muted lg:aspect-16/8" />

                <div className="hidden gap-3 lg:grid">
                    <div className="animate-pulse rounded-3xl bg-surface-muted" />
                    <div className="animate-pulse rounded-3xl bg-surface-muted" />
                </div>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
                <div className="space-y-6">
                    <div className="h-[25rem] animate-pulse rounded-4xl bg-surface-muted" />
                    <div className="h-56 animate-pulse rounded-4xl bg-surface-muted" />
                    <div className="h-64 animate-pulse rounded-4xl bg-surface-muted" />
                </div>

                <div className="h-[32rem] animate-pulse rounded-4xl bg-surface-muted" />
            </div>
        </section>
    );
}

export function PropertyDetailsView({
    propertyId,
}: PropertyDetailsViewProps) {
    const {
        data: property,
        error,
        isLoading,
        isFetching,
        refetch,
    } = useQuery<PropertyDetails, Error>({
        queryKey: propertyDetailsQueryKey(propertyId),
        queryFn: () => getPropertyDetails(propertyId),
    });

    if (isLoading) {
        return <PropertyDetailsSkeleton />;
    }

    if (error || !property) {
        const message =
            error instanceof Error
                ? error.message
                : "The property could not be loaded.";

        return (
            <section className="mx-auto w-full max-w-352 px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/properties"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4"
                    />
                    Back to properties
                </Link>

                <div
                    role="alert"
                    className="mt-8 rounded-4xl border border-danger/20 bg-surface p-8 text-center shadow-soft sm:p-12"
                >
                    <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-danger-soft text-danger">
                        <RefreshCw
                            aria-hidden="true"
                            className={`size-7 ${isFetching ? "animate-spin" : ""
                                }`}
                        />
                    </span>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                        Property unavailable
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                        Property could not be loaded
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                        {message}
                    </p>

                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isFetching ? "Trying again" : "Try again"}
                    </button>
                </div>
            </section>
        );
    }

    const validImages = getValidImages(property.images);
    const primaryImageUrl = validImages[0] ?? null;
    const secondaryImages = validImages.slice(1, 3);

    const averageRating =
        property.reviews.length > 0
            ? property.reviews.reduce(
                (total, review) => total + review.rating,
                0,
            ) / property.reviews.length
            : null;

    return (
        <section
            aria-labelledby="property-details-title"
            className="bg-background py-10 sm:py-12"
        >
            <div className="mx-auto w-full max-w-352 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/properties"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-foreground transition-colors duration-200 hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4"
                    />
                    Back to properties
                </Link>

                <div
                    className={[
                        "mt-6 grid gap-3",
                        secondaryImages.length > 0
                            ? "lg:grid-cols-[minmax(0,1fr)_18rem]"
                            : "",
                    ].join(" ")}
                >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-4xl bg-surface-muted shadow-soft sm:aspect-[16/9] lg:aspect-[16/8]">
                        <PropertyImage
                            key={
                                primaryImageUrl ?? "property-placeholder"
                            }
                            imageUrl={primaryImageUrl}
                            alt={`Rental property: ${property.title}`}
                            sizes={
                                secondaryImages.length > 0
                                    ? "(max-width: 1023px) 100vw, calc(100vw - 18rem)"
                                    : "100vw"
                            }
                            priority
                            className="object-cover"
                        />

                        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
                            <span className="max-w-[70%] truncate rounded-full bg-surface-elevated/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-sm">
                                {property.category.name}
                            </span>

                            <span
                                className={[
                                    "rounded-full px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] shadow-soft backdrop-blur-sm",
                                    statusClasses[property.status],
                                ].join(" ")}
                            >
                                {statusLabels[property.status]}
                            </span>
                        </div>
                    </div>

                    {secondaryImages.length > 0 && (
                        <div className="hidden gap-3 lg:grid">
                            {secondaryImages.map(
                                (imageUrl, index) => (
                                    <div
                                        key={`${imageUrl}-${index}`}
                                        className="relative min-h-0 overflow-hidden rounded-3xl bg-surface-muted shadow-soft"
                                    >
                                        <PropertyImage
                                            imageUrl={imageUrl}
                                            alt={`${property.title} additional view ${index + 1
                                                }`}
                                            sizes="18rem"
                                            className="object-cover"
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="min-w-0 space-y-6">
                        <section className="rounded-4xl border border-border bg-surface p-5 shadow-soft sm:p-7 lg:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                                        <MapPin
                                            aria-hidden="true"
                                            className="mt-1 size-4 shrink-0 text-accent"
                                        />

                                        <span>{property.location}</span>
                                    </p>

                                    <h1
                                        id="property-details-title"
                                        className="mt-3 text-3xl font-bold leading-tight tracking-[-0.05em] text-foreground sm:text-4xl lg:text-5xl"
                                    >
                                        {property.title}
                                    </h1>
                                </div>

                                <div className="shrink-0 rounded-2xl bg-brand-soft px-5 py-4 sm:text-right">
                                    <p className="text-2xl font-bold tracking-[-0.035em] text-brand sm:text-3xl">
                                        {currencyFormatter.format(
                                            property.price,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                                        Checkout amount
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-3 border-y border-border py-5 sm:grid-cols-3">
                                <div className="flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                                        <BedDouble
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </span>

                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            {getCountLabel(
                                                property.bedrooms,
                                                "bedroom",
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Sleeping space
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                                        <Bath
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </span>

                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            {getCountLabel(
                                                property.bathrooms,
                                                "bathroom",
                                            )}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Private facilities
                                        </p>
                                    </div>
                                </div>

                                {property.area !== null && (
                                    <div className="flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3">
                                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                                            <Maximize2
                                                aria-hidden="true"
                                                className="size-4"
                                            />
                                        </span>

                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {property.area.toLocaleString()} sq ft
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Total area
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                    Property overview
                                </p>

                                <h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground">
                                    About this property
                                </h2>

                                <p className="mt-4 whitespace-pre-wrap leading-7 text-muted-foreground">
                                    {property.description}
                                </p>

                                {property.address && (
                                    <div className="mt-6 rounded-2xl border border-border bg-surface-subtle p-4">
                                        <p className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                                            <MapPin
                                                aria-hidden="true"
                                                className="mt-1 size-4 shrink-0 text-accent"
                                            />

                                            <span>
                                                <strong className="font-bold text-foreground">
                                                    Property address:
                                                </strong>{" "}
                                                {property.address}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section
                            aria-labelledby="property-amenities-title"
                            className="rounded-4xl border border-border bg-surface p-5 shadow-soft sm:p-7"
                        >
                            <div className="flex items-start gap-3">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                                        Included features
                                    </p>

                                    <h2
                                        id="property-amenities-title"
                                        className="mt-1 text-2xl font-bold tracking-[-0.035em] text-foreground"
                                    >
                                        Amenities
                                    </h2>
                                </div>
                            </div>

                            {property.amenities.length > 0 ? (
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {property.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center gap-3 rounded-xl bg-surface-subtle px-4 py-3 text-sm font-semibold text-foreground"
                                        >
                                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                                                <Check
                                                    aria-hidden="true"
                                                    className="size-3.5"
                                                />
                                            </span>

                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-5 rounded-xl bg-surface-subtle px-4 py-4 text-sm leading-6 text-muted-foreground">
                                    No amenities have been listed for this
                                    property.
                                </p>
                            )}
                        </section>

                        <section
                            aria-labelledby="property-landlord-title"
                            className="rounded-4xl border border-border bg-surface p-5 shadow-soft sm:p-7"
                        >
                            <div className="flex items-start gap-3">
                                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                                    <Building2
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </span>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                        Property contact
                                    </p>

                                    <h2
                                        id="property-landlord-title"
                                        className="mt-1 text-2xl font-bold tracking-[-0.035em] text-foreground"
                                    >
                                        Landlord information
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-surface-subtle p-4 sm:flex-row sm:items-center sm:p-5">
                                <span
                                    aria-hidden="true"
                                    className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand text-lg font-bold text-brand-foreground"
                                >
                                    {getLandlordInitial(
                                        property.landlord.name,
                                    )}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-foreground">
                                        {property.landlord.name}
                                    </p>

                                    <div className="mt-3 flex flex-col gap-2">
                                        <a
                                            href={`mailto:${property.landlord.email}`}
                                            className="inline-flex w-fit max-w-full items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-brand"
                                        >
                                            <Mail
                                                aria-hidden="true"
                                                className="size-4 shrink-0 text-brand"
                                            />
                                            <span className="truncate">
                                                {property.landlord.email}
                                            </span>
                                        </a>

                                        {property.landlord.phone && (
                                            <a
                                                href={`tel:${property.landlord.phone}`}
                                                className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-brand"
                                            >
                                                <Phone
                                                    aria-hidden="true"
                                                    className="size-4 shrink-0 text-brand"
                                                />
                                                {property.landlord.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section
                            aria-labelledby="property-reviews-title"
                            className="rounded-4xl border border-border bg-surface p-5 shadow-soft sm:p-7"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
                                        <Star
                                            aria-hidden="true"
                                            className="size-5 fill-warning"
                                        />
                                    </span>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-warning">
                                            Tenant feedback
                                        </p>

                                        <h2
                                            id="property-reviews-title"
                                            className="mt-1 text-2xl font-bold tracking-[-0.035em] text-foreground"
                                        >
                                            Reviews
                                        </h2>
                                    </div>
                                </div>

                                {averageRating !== null && (
                                    <div className="w-fit rounded-xl bg-warning-soft px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <RatingStars
                                                rating={averageRating}
                                                label={`Average rating ${averageRating.toFixed(
                                                    1,
                                                )} out of 5`}
                                            />

                                            <span className="text-sm font-bold text-warning">
                                                {averageRating.toFixed(1)}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {property.reviews.length}{" "}
                                            {property.reviews.length === 1
                                                ? "review"
                                                : "reviews"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {property.reviews.length > 0 ? (
                                <div className="mt-6 grid gap-4">
                                    {property.reviews.map((review) => (
                                        <article
                                            key={review.id}
                                            className="rounded-2xl border border-border bg-surface-subtle p-4 sm:p-5"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <RatingStars
                                                    rating={review.rating}
                                                    label={`${review.rating} out of 5 stars`}
                                                />

                                                <time
                                                    dateTime={review.createdAt}
                                                    className="text-xs font-medium text-muted-foreground"
                                                >
                                                    {dateFormatter.format(
                                                        new Date(review.createdAt),
                                                    )}
                                                </time>
                                            </div>

                                            {review.comment ? (
                                                <p className="mt-4 leading-7 text-muted-foreground">
                                                    “{review.comment}”
                                                </p>
                                            ) : (
                                                <p className="mt-4 text-sm italic text-muted-foreground">
                                                    The tenant submitted a rating without
                                                    a written comment.
                                                </p>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-2xl bg-surface-subtle px-5 py-6 text-center">
                                    <p className="font-bold text-foreground">
                                        No reviews yet
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                        Tenant reviews will appear here after
                                        completed rental experiences.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-24">
                        <RentalRequestForm
                            propertyId={property.id}
                            propertyTitle={property.title}
                            propertyStatus={property.status}
                        />
                    </aside>
                </div>
            </div>
        </section>
    );
}