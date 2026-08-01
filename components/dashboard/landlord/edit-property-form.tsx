"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    ArrowLeft,
    Bath,
    BedDouble,
    Building2,
    CircleAlert,
    DollarSign,
    ImageIcon,
    LoaderCircle,
    LockKeyhole,
    MapPin,
    RefreshCw,
    Ruler,
    Save,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toaster } from "@/components/ui/app-toaster";
import { getCategories } from "@/lib/api/categories";
import {
    getLandlordProperty,
    landlordPropertiesQueryKey,
    landlordPropertyQueryKey,
    updateLandlordProperty,
} from "@/lib/api/landlord-properties-client";
import {
    createUpdatePropertyPayload,
} from "@/lib/properties/create-property-payload";
import {
    createEditPropertyFormValues,
} from "@/lib/properties/edit-property-form-values";
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

const baseInputClassName =
    "h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

const baseTextareaClassName =
    "w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

function getInputClassName(hasError: boolean) {
    return [
        baseInputClassName,
        hasError
            ? "border-danger focus:border-danger focus:ring-danger/10"
            : "border-border",
    ].join(" ");
}

function getTextareaClassName(
    hasError: boolean,
) {
    return [
        baseTextareaClassName,
        hasError
            ? "border-danger focus:border-danger focus:ring-danger/10"
            : "border-border",
    ].join(" ");
}

type FormSectionHeaderProps = Readonly<{
    icon: LucideIcon;
    eyebrow: string;
    title: string;
    description: string;
}>;

function FormSectionHeader({
    icon: Icon,
    eyebrow,
    title,
    description,
}: FormSectionHeaderProps) {
    return (
        <div className="flex items-start gap-4 border-b border-border pb-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                <Icon
                    aria-hidden="true"
                    className="size-5"
                />
            </span>

            <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-brand">
                    {eyebrow}
                </p>

                <h2 className="mt-1.5 text-lg font-bold tracking-[-0.025em] text-foreground">
                    {title}
                </h2>

                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

type FieldErrorProps = Readonly<{
    id: string;
    message?: string;
}>;

function FieldError({
    id,
    message,
}: FieldErrorProps) {
    if (!message) {
        return null;
    }

    return (
        <p
            id={id}
            role="alert"
            className="mt-2 text-sm font-medium text-danger"
        >
            {message}
        </p>
    );
}

function EditPropertySkeleton() {
    return (
        <section aria-label="Loading property editor">
            <div className="h-10 w-40 animate-pulse rounded-xl bg-surface-muted" />

            <div className="mt-5 h-72 animate-pulse rounded-[2rem] border border-border bg-surface-muted" />

            <div className="mt-8 space-y-6">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className="h-80 animate-pulse rounded-[1.75rem] border border-border bg-surface-muted"
                    />
                ))}
            </div>
        </section>
    );
}

type EditPropertyFormProps = Readonly<{
    propertyId: string;
}>;

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

        reset(createEditPropertyFormValues(property));
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
                    queryKey: landlordPropertiesQueryKey,
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
        return <EditPropertySkeleton />;
    }

    if (propertyError || !property) {
        const errorMessage =
            propertyError instanceof Error
                ? propertyError.message
                : "The property could not be loaded.";

        return (
            <section aria-labelledby="property-load-error-title">
                <Link
                    href="/dashboard/landlord/properties"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4"
                    />

                    Back to properties
                </Link>

                <div
                    role="alert"
                    className="mt-8 rounded-[2rem] border border-danger/20 bg-surface p-8 text-center shadow-soft sm:p-12"
                >
                    <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] bg-danger-soft text-danger">
                        <RefreshCw
                            aria-hidden="true"
                            className={`size-7 ${isPropertyFetching
                                ? "animate-spin"
                                : ""
                                }`}
                        />
                    </span>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-danger">
                        Property unavailable
                    </p>

                    <h1
                        id="property-load-error-title"
                        className="mt-2 text-2xl font-bold tracking-[-0.035em] text-foreground"
                    >
                        Property could not be loaded
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            void refetchProperty()
                        }
                        disabled={isPropertyFetching}
                        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                    >
                        {isPropertyFetching && (
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />
                        )}

                        {isPropertyFetching
                            ? "Trying again"
                            : "Try again"}
                    </button>
                </div>
            </section>
        );
    }

    const isRented =
        property.status === "RENTED";

    const isPending =
        isSubmitting ||
        updatePropertyMutation.isPending;

    const isSubmitDisabled =
        isPending ||
        isCategoriesLoading ||
        Boolean(categoriesError) ||
        categories.length === 0 ||
        !isDirty;

    return (
        <section aria-labelledby="edit-property-title">
            <Link
                href="/dashboard/landlord/properties"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-hover"
            >
                <ArrowLeft
                    aria-hidden="true"
                    className="size-4"
                />

                Back to properties
            </Link>

            <header className="relative mt-5 overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
                <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-24 rounded-l-[3rem] bg-accent-soft lg:block"
                />

                <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div className="max-w-3xl">
                        <span className="inline-flex rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-accent">
                            Edit rental listing
                        </span>

                        <h1
                            id="edit-property-title"
                            className="mt-5 text-4xl font-bold leading-[1.08] tracking-[-0.05em] text-foreground sm:text-5xl"
                        >
                            Keep your property
                            <span className="block text-brand">
                                accurate and current.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                            Update the information, pricing,
                            availability, amenities, and images for{" "}
                            <strong className="font-bold text-foreground">
                                {property.title}
                            </strong>
                            .
                        </p>
                    </div>

                    {isPropertyFetching && (
                        <div
                            role="status"
                            className="flex w-fit items-center gap-2 rounded-full bg-info-soft px-3.5 py-2 text-xs font-bold text-info"
                        >
                            <LoaderCircle
                                aria-hidden="true"
                                className="size-3.5 animate-spin"
                            />

                            Refreshing property
                        </div>
                    )}
                </div>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-8 space-y-6"
            >
                {errors.root && (
                    <div
                        role="alert"
                        className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger-soft px-5 py-4"
                    >
                        <CircleAlert
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0 text-danger"
                        />

                        <div>
                            <p className="text-sm font-bold text-danger">
                                Property could not be updated
                            </p>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {errors.root.message}
                            </p>
                        </div>
                    </div>
                )}

                <section
                    aria-labelledby="edit-property-information-title"
                    className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-7"
                >
                    <FormSectionHeader
                        icon={Building2}
                        eyebrow="Section 01"
                        title="Property information"
                        description="Update the core listing information and availability tenants will see."
                    />

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-title"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Property title
                            </label>

                            <input
                                id="property-title"
                                type="text"
                                disabled={isPending}
                                aria-invalid={Boolean(errors.title)}
                                aria-describedby={
                                    errors.title
                                        ? "property-title-error"
                                        : undefined
                                }
                                {...register("title")}
                                className={getInputClassName(
                                    Boolean(errors.title),
                                )}
                            />

                            <FieldError
                                id="property-title-error"
                                message={errors.title?.message}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-description"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Description
                            </label>

                            <textarea
                                id="property-description"
                                rows={6}
                                disabled={isPending}
                                aria-invalid={Boolean(
                                    errors.description,
                                )}
                                aria-describedby={
                                    errors.description
                                        ? "property-description-error"
                                        : undefined
                                }
                                {...register("description")}
                                className={getTextareaClassName(
                                    Boolean(errors.description),
                                )}
                            />

                            <FieldError
                                id="property-description-error"
                                message={
                                    errors.description?.message
                                }
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-category"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Property type
                            </label>

                            <select
                                id="property-category"
                                disabled={
                                    isPending ||
                                    isCategoriesLoading ||
                                    Boolean(categoriesError)
                                }
                                aria-invalid={Boolean(
                                    errors.categoryId,
                                )}
                                aria-describedby={
                                    errors.categoryId
                                        ? "property-category-error"
                                        : categoriesError
                                            ? "property-categories-load-error"
                                            : undefined
                                }
                                {...register("categoryId")}
                                className={getInputClassName(
                                    Boolean(errors.categoryId),
                                )}
                            >
                                <option value="">
                                    {isCategoriesLoading
                                        ? "Loading property types..."
                                        : categories.length === 0
                                            ? "No property types available"
                                            : "Choose a property type"}
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <FieldError
                                id="property-category-error"
                                message={
                                    errors.categoryId?.message
                                }
                            />

                            {categoriesError && (
                                <p
                                    id="property-categories-load-error"
                                    role="alert"
                                    className="mt-2 text-sm font-medium text-danger"
                                >
                                    Property types could not be loaded.
                                    Refresh the page and try again.
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="property-price"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Total rental price
                            </label>

                            <div className="relative">
                                <DollarSign
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    id="property-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    disabled={isPending}
                                    aria-invalid={Boolean(
                                        errors.price,
                                    )}
                                    aria-describedby={
                                        errors.price
                                            ? "property-price-error"
                                            : undefined
                                    }
                                    {...register("price")}
                                    className={`${getInputClassName(
                                        Boolean(errors.price),
                                    )} pl-10`}
                                />
                            </div>

                            <FieldError
                                id="property-price-error"
                                message={errors.price?.message}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="property-status"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Availability status
                            </label>

                            <select
                                id="property-status"
                                disabled={isPending || isRented}
                                aria-invalid={Boolean(
                                    errors.status,
                                )}
                                aria-describedby={[
                                    errors.status
                                        ? "property-status-error"
                                        : "",
                                    isRented
                                        ? "property-rented-status-help"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ") || undefined}
                                {...register("status")}
                                className={getInputClassName(
                                    Boolean(errors.status),
                                )}
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
                                <div
                                    id="property-rented-status-help"
                                    className="mt-3 flex items-start gap-3 rounded-xl border border-info/20 bg-info-soft px-4 py-3"
                                >
                                    <LockKeyhole
                                        aria-hidden="true"
                                        className="mt-0.5 size-4 shrink-0 text-info"
                                    />

                                    <p className="text-xs leading-5 text-muted-foreground">
                                        This property is currently rented.
                                        Availability is managed automatically
                                        through its rental record.
                                    </p>
                                </div>
                            )}

                            <FieldError
                                id="property-status-error"
                                message={errors.status?.message}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-7">
                    <FormSectionHeader
                        icon={MapPin}
                        eyebrow="Section 02"
                        title="Location and dimensions"
                        description="Update where the property is located and the space available to tenants."
                    />

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="property-location"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Location
                            </label>

                            <input
                                id="property-location"
                                type="text"
                                disabled={isPending}
                                aria-invalid={Boolean(
                                    errors.location,
                                )}
                                aria-describedby={
                                    errors.location
                                        ? "property-location-error"
                                        : undefined
                                }
                                {...register("location")}
                                className={getInputClassName(
                                    Boolean(errors.location),
                                )}
                            />

                            <FieldError
                                id="property-location-error"
                                message={errors.location?.message}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-address"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Full address{" "}
                                <span className="font-medium text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <input
                                id="property-address"
                                type="text"
                                disabled={isPending}
                                aria-invalid={Boolean(
                                    errors.address,
                                )}
                                aria-describedby={
                                    errors.address
                                        ? "property-address-error"
                                        : undefined
                                }
                                {...register("address")}
                                className={getInputClassName(
                                    Boolean(errors.address),
                                )}
                            />

                            <FieldError
                                id="property-address-error"
                                message={errors.address?.message}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-bedrooms"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Bedrooms
                            </label>

                            <div className="relative">
                                <BedDouble
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    id="property-bedrooms"
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    disabled={isPending}
                                    aria-invalid={Boolean(
                                        errors.bedrooms,
                                    )}
                                    aria-describedby={
                                        errors.bedrooms
                                            ? "property-bedrooms-error"
                                            : undefined
                                    }
                                    {...register("bedrooms")}
                                    className={`${getInputClassName(
                                        Boolean(errors.bedrooms),
                                    )} pl-10`}
                                />
                            </div>

                            <FieldError
                                id="property-bedrooms-error"
                                message={errors.bedrooms?.message}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-bathrooms"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Bathrooms
                            </label>

                            <div className="relative">
                                <Bath
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                />

                                <input
                                    id="property-bathrooms"
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    disabled={isPending}
                                    aria-invalid={Boolean(
                                        errors.bathrooms,
                                    )}
                                    aria-describedby={
                                        errors.bathrooms
                                            ? "property-bathrooms-error"
                                            : undefined
                                    }
                                    {...register("bathrooms")}
                                    className={`${getInputClassName(
                                        Boolean(errors.bathrooms),
                                    )} pl-10`}
                                />
                            </div>

                            <FieldError
                                id="property-bathrooms-error"
                                message={errors.bathrooms?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="property-area"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Area in square feet{" "}
                                <span className="font-medium text-muted-foreground">
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
                                    disabled={isPending}
                                    aria-invalid={Boolean(errors.area)}
                                    aria-describedby={
                                        errors.area
                                            ? "property-area-error"
                                            : undefined
                                    }
                                    {...register("area")}
                                    className={`${getInputClassName(
                                        Boolean(errors.area),
                                    )} pl-10`}
                                />
                            </div>

                            <FieldError
                                id="property-area-error"
                                message={errors.area?.message}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft sm:p-7">
                    <FormSectionHeader
                        icon={Sparkles}
                        eyebrow="Section 03"
                        title="Amenities and images"
                        description="Update useful property features and externally hosted listing images."
                    />

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">
                        <div>
                            <label
                                htmlFor="property-amenities"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Amenities{" "}
                                <span className="font-medium text-muted-foreground">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                id="property-amenities"
                                rows={6}
                                placeholder={
                                    "Parking, Wi-Fi, Air conditioning\nSeparate amenities with commas or new lines."
                                }
                                disabled={isPending}
                                aria-invalid={Boolean(
                                    errors.amenities,
                                )}
                                aria-describedby={
                                    errors.amenities
                                        ? "property-amenities-error"
                                        : "property-amenities-help"
                                }
                                {...register("amenities")}
                                className={getTextareaClassName(
                                    Boolean(errors.amenities),
                                )}
                            />

                            <p
                                id="property-amenities-help"
                                className="mt-2 text-xs leading-5 text-muted-foreground"
                            >
                                Separate amenities with commas or new
                                lines.
                            </p>

                            <FieldError
                                id="property-amenities-error"
                                message={errors.amenities?.message}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="property-images"
                                className="mb-2 block text-sm font-bold text-foreground"
                            >
                                Image URLs{" "}
                                <span className="font-medium text-muted-foreground">
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
                                    placeholder={
                                        "https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"
                                    }
                                    disabled={isPending}
                                    aria-invalid={Boolean(
                                        errors.imageUrls,
                                    )}
                                    aria-describedby={
                                        errors.imageUrls
                                            ? "property-images-error"
                                            : "property-images-help"
                                    }
                                    {...register("imageUrls")}
                                    className={`${getTextareaClassName(
                                        Boolean(errors.imageUrls),
                                    )} pl-11`}
                                />
                            </div>

                            <p
                                id="property-images-help"
                                className="mt-2 text-xs leading-5 text-muted-foreground"
                            >
                                Enter one HTTP or HTTPS image URL per
                                line.
                            </p>

                            <FieldError
                                id="property-images-error"
                                message={errors.imageUrls?.message}
                            />
                        </div>
                    </div>
                </section>

                <div className="flex flex-col-reverse gap-3 rounded-[1.5rem] border border-border bg-surface-subtle p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {isDirty
                                ? "You have unsaved changes."
                                : "No changes to save."}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Changes become visible after the property
                            update succeeds.
                        </p>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Link
                            href="/dashboard/landlord/properties"
                            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-background px-6 text-sm font-bold text-foreground transition-colors duration-200 hover:bg-surface-muted"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60"
                        >
                            {isPending ? (
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
                </div>
            </form>
        </section>
    );
}