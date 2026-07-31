"use client";

import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Bath,
    BedDouble,
    Building2,
    Mail,
    MapPin,
    Maximize2,
    Phone,
    RefreshCw,
    Sparkles,
    Star,
} from "lucide-react";
import Link from "next/link";
import type { PropertyDetails } from "@/types/property";

import { PropertyImage } from "@/components/properties/property-image";
import { RentalRequestForm } from "@/components/properties/rental-request-form";
import {
    getPropertyDetails,
    propertyDetailsQueryKey,
} from "@/lib/api/property-details-client";

const currencyFormatter = new Intl.NumberFormat(
    "en-US",
    {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    },
);

const dateFormatter =
    new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    });

type PropertyDetailsViewProps = Readonly<{
    propertyId: string;
}>;

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
        queryKey:
            propertyDetailsQueryKey(propertyId),
        queryFn: () =>
            getPropertyDetails(propertyId),
    });

    if (isLoading) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="h-5 w-36 animate-pulse rounded-lg bg-surface-muted" />
                <div className="mt-7 aspect-[16/8] animate-pulse rounded-[2rem] bg-surface-muted" />
                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="h-96 animate-pulse rounded-[1.75rem] bg-surface-muted" />
                    <div className="h-96 animate-pulse rounded-[1.75rem] bg-surface-muted" />
                </div>
            </section>
        );
    }

    if (error || !property) {
        const message =
            error instanceof Error
                ? error.message
                : "The property could not be loaded.";

        return (
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4"
                    />
                    Back to properties
                </Link>

                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <RefreshCw
                        aria-hidden="true"
                        className="mx-auto size-7 text-brand"
                    />

                    <h1 className="mt-5 text-xl font-semibold text-foreground">
                        Property could not be loaded
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {message}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground disabled:opacity-60"
                    >
                        {isFetching
                            ? "Trying again..."
                            : "Try again"}
                    </button>
                </div>
            </section>
        );
    }

    const primaryImageUrl =
        property.images.find(
            (imageUrl) => imageUrl.trim(),
        ) ?? null;

    const averageRating =
        property.reviews.length > 0
            ? property.reviews.reduce(
                (total, review) =>
                    total + review.rating,
                0,
            ) / property.reviews.length
            : null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-opacity hover:opacity-75"
            >
                <ArrowLeft
                    aria-hidden="true"
                    className="size-4"
                />
                Back to properties
            </Link>

            <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-[2rem] border border-border bg-surface-muted lg:aspect-[16/7]">
                <PropertyImage
                    key={
                        primaryImageUrl ??
                        "property-placeholder"
                    }
                    imageUrl={primaryImageUrl}
                    alt={`Rental property: ${property.title}`}
                    sizes="100vw"
                    className="object-cover"
                />

                <span className="absolute left-5 top-5 rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {property.category.name}
                </span>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
                <div className="space-y-6">
                    <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin
                                        aria-hidden="true"
                                        className="size-4 text-brand"
                                    />
                                    {property.location}
                                </p>

                                <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
                                    {property.title}
                                </h1>
                            </div>

                            <div className="shrink-0 sm:text-right">
                                <p className="text-3xl font-semibold text-brand">
                                    {currencyFormatter.format(
                                        property.price,
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Total one-time payment
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3 border-y border-border py-5">
                            <span className="inline-flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm text-foreground">
                                <BedDouble className="size-4 text-brand" />
                                {property.bedrooms} bedrooms
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm text-foreground">
                                <Bath className="size-4 text-brand" />
                                {property.bathrooms} bathrooms
                            </span>

                            {property.area !== null && (
                                <span className="inline-flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2 text-sm text-foreground">
                                    <Maximize2 className="size-4 text-brand" />
                                    {property.area} sq ft
                                </span>
                            )}
                        </div>

                        <h2 className="mt-6 text-xl font-semibold text-foreground">
                            About this property
                        </h2>

                        <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
                            {property.description}
                        </p>

                        {property.address && (
                            <p className="mt-5 text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    Address:
                                </span>{" "}
                                {property.address}
                            </p>
                        )}
                    </section>

                    <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <Sparkles className="size-5 text-brand" />
                            Amenities
                        </h2>

                        {property.amenities.length > 0 ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                                {property.amenities.map(
                                    (amenity) => (
                                        <span
                                            key={amenity}
                                            className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                                        >
                                            {amenity}
                                        </span>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                                No amenities have been listed.
                            </p>
                        )}
                    </section>

                    <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                        <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                            <Building2 className="size-5 text-brand" />
                            Landlord
                        </h2>

                        <p className="mt-4 font-semibold text-foreground">
                            {property.landlord.name}
                        </p>

                        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-4 text-brand" />
                            {property.landlord.email}
                        </p>

                        {property.landlord.phone && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="size-4 text-brand" />
                                {property.landlord.phone}
                            </p>
                        )}
                    </section>

                    <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                                <Star className="size-5 text-brand" />
                                Reviews
                            </h2>

                            {averageRating !== null && (
                                <p className="text-sm font-semibold text-brand">
                                    {averageRating.toFixed(1)} / 5
                                </p>
                            )}
                        </div>

                        {property.reviews.length > 0 ? (
                            <div className="mt-5 space-y-4">
                                {property.reviews.map(
                                    (review) => (
                                        <article
                                            key={review.id}
                                            className="rounded-xl border border-border bg-background p-4"
                                        >
                                            <p className="font-semibold text-foreground">
                                                {review.rating} / 5
                                            </p>

                                            {review.comment && (
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                                    {review.comment}
                                                </p>
                                            )}

                                            <p className="mt-3 text-xs text-muted-foreground">
                                                {dateFormatter.format(
                                                    new Date(
                                                        review.createdAt,
                                                    ),
                                                )}
                                            </p>
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                                No reviews have been submitted yet.
                            </p>
                        )}
                    </section>
                </div>

                <div className="lg:sticky lg:top-24">
                    <RentalRequestForm
                        propertyId={property.id}
                        propertyTitle={property.title}
                        propertyStatus={property.status}
                    />
                </div>
            </div>
        </section>
    );
}