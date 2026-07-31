"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Building2,
    ImageIcon,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Ruler,
    Save,
    Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toaster } from "@/components/ui/app-toaster";
import { getCategories } from "@/lib/api/categories";
import {
    getLandlordProperty,
    landlordPropertiesQueryKey,
    landlordPropertyQueryKey,
    updateLandlordProperty,
} from "@/lib/api/landlord-properties-client";
import {
    createEditPropertyFormValues,
} from "@/lib/properties/edit-property-form-values";
import {
    createUpdatePropertyPayload,
} from "@/lib/properties/create-property-payload";
import {
    editPropertySchema,
    type EditPropertyFormValues,
} from "@/lib/validation/property-schema";
import type { LandlordProperty } from "@/types/property";

const defaultValues: EditPropertyFormValues = {
    title: "",
    description: "",
    location: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    categoryId: "",
    amenities: "",
    imageUrls: "",
    status: "AVAILABLE",
};

const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
    "w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus disabled:cursor-not-allowed disabled:opacity-60";

type EditPropertyFormProps = Readonly<{
    propertyId: string;
}>;

type FormSectionHeaderProps = Readonly<{
    icon: LucideIcon;
    title: string;
    description: string;
}>;

function FormSectionHeader({
    icon: Icon,
    title,
    description,
}: FormSectionHeaderProps) {
    return (
        <div className="flex items-start gap-3 border-b border-border pb-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                <Icon aria-hidden="true" className="size-5" />
            </span>

            <div>
                <h2 className="font-semibold text-foreground">
                    {title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

type FieldErrorProps = Readonly<{
    message?: string;
}>;

function FieldError({
    message,
}: FieldErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
            {message}
        </p>
    );
}

export function EditPropertyForm({
    propertyId,
}: EditPropertyFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const propertyQueryKey =
        landlordPropertyQueryKey(propertyId);

    const {
        data: property,
        error: propertyError,
        isLoading: isPropertyLoading,
        isFetching: isPropertyFetching,
        refetch: refetchProperty,
    } = useQuery({
        queryKey: propertyQueryKey,
        queryFn: () =>
            getLandlordProperty(propertyId),
    });

    const {
        data: categories = [],
        error: categoriesError,
        isLoading: isCategoriesLoading,
    } = useQuery({
        queryKey: ["property-categories"],
        queryFn: getCategories,
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
            isDirty,
        },
    } = useForm<EditPropertyFormValues>({
        resolver: zodResolver(editPropertySchema),
        defaultValues,
    });

    useEffect(() => {
        if (!property) {
            return;
        }

        reset(
            createEditPropertyFormValues(property),
        );
    }, [property, reset]);

    const updatePropertyMutation = useMutation({
        mutationFn: (
            values: EditPropertyFormValues,
        ) =>
            updateLandlordProperty(
                propertyId,
                createUpdatePropertyPayload(values),
            ),
    });

    async function onSubmit(
        values: EditPropertyFormValues,
    ) {
        clearErrors("root");

        try {
            const updatedProperty =
                await updatePropertyMutation.mutateAsync(
                    values,
                );

            queryClient.setQueryData(
                propertyQueryKey,
                updatedProperty,
            );

            queryClient.setQueryData<
                LandlordProperty[]
            >(
                landlordPropertiesQueryKey,
                (currentProperties = []) =>
                    currentProperties.map(
                        (currentProperty) =>
                            currentProperty.id ===
                                updatedProperty.id
                                ? updatedProperty
                                : currentProperty,
                    ),
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:
                        landlordPropertiesQueryKey,
                }),
                queryClient.invalidateQueries({
                    queryKey: ["properties"],
                }),
            ]);

            toaster.success({
                title: "Property updated",
                description: `${updatedProperty.title} was updated successfully.`,
            });

            router.replace(
                "/dashboard/landlord/properties",
            );
            router.refresh();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "The property could not be updated.";

            setError("root", {
                type: "server",
                message,
            });

            toaster.error({
                title: "Property update failed",
                description: message,
            });
        }
    }

    if (isPropertyLoading) {
        return (
            <section>
                <div className="h-5 w-36 animate-pulse rounded-lg bg-surface-muted" />

                <div className="mt-6 border-b border-border pb-8">
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-surface-muted" />
                    <div className="mt-4 h-12 max-w-xl animate-pulse rounded-xl bg-surface-muted" />
                    <div className="mt-4 h-5 max-w-2xl animate-pulse rounded-lg bg-surface-muted" />
                </div>

                <div className="mt-8 space-y-6">
                    {Array.from(
                        {
                            length: 3,
                        },
                        (_, index) => (
                            <div
                                key={index}
                                className="h-80 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                            />
                        ),
                    )}
                </div>
            </section>
        );
    }

    if (propertyError || !property) {
        const errorMessage =
            propertyError instanceof Error
                ? propertyError.message
                : "The property could not be loaded.";

        return (
            <section>
                <Link
                    href="/dashboard/landlord/properties"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-opacity hover:opacity-75"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4"
                    />
                    Back to properties
                </Link>

                <div className="mt-8 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-muted text-brand">
                        <RefreshCw
                            aria-hidden="true"
                            className="size-6"
                        />
                    </span>

                    <h1 className="mt-5 text-xl font-semibold text-foreground">
                        Property could not be loaded
                    </h1>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => refetchProperty()}
                        disabled={isPropertyFetching}
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isPropertyFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isPropertyFetching
                            ? "Trying again..."
                            : "Try again"}
                    </button>
                </div>
            </section>
        );
    }

    const isRented =
        property.status === "RENTED";

    const isSubmitDisabled =
        isSubmitting ||
        updatePropertyMutation.isPending ||
        isCategoriesLoading ||
        Boolean(categoriesError) ||
        categories.length === 0 ||
        !isDirty;

    return (
        <section>
            <Link
                href="/dashboard/landlord/properties"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-opacity hover:opacity-75"
            >
                <ArrowLeft
                    aria-hidden="true"
                    className="size-4"
                />
                Back to properties
            </Link>

            <div className="mt-6 border-b border-border pb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                    Edit rental listing
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    Update {property.title}.
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                    Keep the property information,
                    availability, pricing, amenities, and
                    images accurate for prospective tenants.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-8 space-y-6"
            >
                {errors.root && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
                    >
                        {errors.root.message}
                    </div>
                )}

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                    <FormSectionHeader
                        icon={Building2}
                        title="Property information"
                        description="Update the primary information tenants will see."
                    />

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-title"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Property title
                            </label>

                            <input
                                id="property-title"
                                type="text"
                                aria-invalid={Boolean(
                                    errors.title,
                                )}
                                {...register("title")}
                                className={inputClassName}
                            />

                            <FieldError
                                message={
                                    errors.title?.message
                                }
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-description"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Description
                            </label>

                            <textarea
                                id="property-description"
                                rows={6}
                                aria-invalid={Boolean(
                                    errors.description,
                                )}
                                {...register("description")}
                                className={textareaClassName}
                            />

                            <FieldError
                                message={
                                    errors.description?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-category"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Property type
                            </label>

                            <select
                                id="property-category"
                                disabled={
                                    isCategoriesLoading ||
                                    Boolean(categoriesError)
                                }
                                aria-invalid={Boolean(
                                    errors.categoryId,
                                )}
                                {...register("categoryId")}
                                className={inputClassName}
                            >
                                <option value="">
                                    {isCategoriesLoading
                                        ? "Loading property types..."
                                        : categories.length === 0
                                            ? "No property types available"
                                            : "Choose a property type"}
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ),
                                )}
                            </select>

                            <FieldError
                                message={
                                    errors.categoryId?.message
                                }
                            />

                            {categoriesError && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    Property types could not be
                                    loaded. Refresh the page and
                                    try again.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="property-price"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Total rental price
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                                    $
                                </span>

                                <input
                                    id="property-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    aria-invalid={Boolean(
                                        errors.price,
                                    )}
                                    {...register("price")}
                                    className={`${inputClassName} pl-8`}
                                />
                            </div>

                            <FieldError
                                message={
                                    errors.price?.message
                                }
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-status"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Availability status
                            </label>

                            <select
                                id="property-status"
                                disabled={isRented}
                                aria-invalid={Boolean(
                                    errors.status,
                                )}
                                {...register("status")}
                                className={inputClassName}
                            >
                                <option value="AVAILABLE">
                                    Available
                                </option>

                                <option value="UNAVAILABLE">
                                    Unavailable
                                </option>

                                {isRented && (
                                    <option value="RENTED">
                                        Rented
                                    </option>
                                )}
                            </select>

                            {isRented && (
                                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                    A rented property’s availability
                                    is managed through its rental
                                    record.
                                </p>
                            )}

                            <FieldError
                                message={
                                    errors.status?.message
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                    <FormSectionHeader
                        icon={MapPin}
                        title="Location and dimensions"
                        description="Update where the property is and how much space it offers."
                    />

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="property-location"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Location
                            </label>

                            <input
                                id="property-location"
                                type="text"
                                aria-invalid={Boolean(
                                    errors.location,
                                )}
                                {...register("location")}
                                className={inputClassName}
                            />

                            <FieldError
                                message={
                                    errors.location?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-address"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Full address{" "}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <input
                                id="property-address"
                                type="text"
                                aria-invalid={Boolean(
                                    errors.address,
                                )}
                                {...register("address")}
                                className={inputClassName}
                            />

                            <FieldError
                                message={
                                    errors.address?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-bedrooms"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Bedrooms
                            </label>

                            <input
                                id="property-bedrooms"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                aria-invalid={Boolean(
                                    errors.bedrooms,
                                )}
                                {...register("bedrooms")}
                                className={inputClassName}
                            />

                            <FieldError
                                message={
                                    errors.bedrooms?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-bathrooms"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Bathrooms
                            </label>

                            <input
                                id="property-bathrooms"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                aria-invalid={Boolean(
                                    errors.bathrooms,
                                )}
                                {...register("bathrooms")}
                                className={inputClassName}
                            />

                            <FieldError
                                message={
                                    errors.bathrooms?.message
                                }
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="property-area"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Area in square feet{" "}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <div className="relative">
                                <Ruler
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    id="property-area"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    aria-invalid={Boolean(
                                        errors.area,
                                    )}
                                    {...register("area")}
                                    className={`${inputClassName} pl-10`}
                                />
                            </div>

                            <FieldError
                                message={
                                    errors.area?.message
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                    <FormSectionHeader
                        icon={Sparkles}
                        title="Amenities and images"
                        description="Update useful property features and externally hosted images."
                    />

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <div>
                            <label
                                htmlFor="property-amenities"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Amenities{" "}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="property-amenities"
                                rows={6}
                                aria-invalid={Boolean(
                                    errors.amenities,
                                )}
                                {...register("amenities")}
                                className={textareaClassName}
                            />

                            <FieldError
                                message={
                                    errors.amenities?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-images"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Image URLs{" "}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <div className="relative">
                                <ImageIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-4 top-4 size-4 text-muted-foreground"
                                />

                                <textarea
                                    id="property-images"
                                    rows={6}
                                    aria-invalid={Boolean(
                                        errors.imageUrls,
                                    )}
                                    {...register("imageUrls")}
                                    className={`${textareaClassName} pl-11`}
                                />
                            </div>

                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                Enter one supported HTTP or HTTPS
                                image URL per line.
                            </p>

                            <FieldError
                                message={
                                    errors.imageUrls?.message
                                }
                            />
                        </div>
                    </div>
                </section>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                    <Link
                        href="/dashboard/landlord/properties"
                        className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                    >
                        {isSubmitting ||
                            updatePropertyMutation.isPending ? (
                            <>
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="size-4 animate-spin"
                                />
                                Saving changes...
                            </>
                        ) : (
                            <>
                                <Save
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Save changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}