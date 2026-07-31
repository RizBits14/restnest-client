"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowLeft,
    Building2,
    ImageIcon,
    LoaderCircle,
    MapPin,
    Ruler,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toaster } from "@/components/ui/app-toaster";
import { getCategories } from "@/lib/api/categories";
import { createLandlordProperty } from "@/lib/api/landlord-properties-client";
import { createPropertyPayload } from "@/lib/properties/create-property-payload";
import {
    createPropertySchema,
    type CreatePropertyFormValues,
} from "@/lib/validation/property-schema";

const defaultValues: CreatePropertyFormValues = {
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
};

export function CreatePropertyForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: categories = [],
        error: categoriesError,
        isLoading: isCategoriesLoading,
    } = useQuery({
        queryKey: ["property-categories"],
        queryFn: getCategories,
    });

    const createPropertyMutation = useMutation({
        mutationFn: createLandlordProperty,
    });

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CreatePropertyFormValues>({
        resolver: zodResolver(createPropertySchema),
        defaultValues,
    });

    async function onSubmit(
        values: CreatePropertyFormValues,
    ) {
        clearErrors("root");

        try {
            const property =
                await createPropertyMutation.mutateAsync(
                    createPropertyPayload(values),
                );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["landlord", "properties"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["properties"],
                }),
            ]);

            toaster.success({
                title: "Property created",
                description: `${property.title} is now listed on RESTNEST.`,
            });

            router.replace(
                "/dashboard/landlord/properties",
            );
            router.refresh();
        } catch (error) {
            setError("root", {
                type: "server",
                message:
                    error instanceof Error
                        ? error.message
                        : "The property could not be created.",
            });
        }
    }

    const isSubmitDisabled =
        isSubmitting ||
        createPropertyMutation.isPending ||
        isCategoriesLoading ||
        Boolean(categoriesError) ||
        categories.length === 0;

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
                    New rental listing
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
                    Add a property to RESTNEST.
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                    Provide accurate property details, a one-time rental price,
                    amenities, and optional image URLs.
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
                    <div className="flex items-start gap-3 border-b border-border pb-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                            <Building2
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Property information
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Add the primary information tenants will see.
                            </p>
                        </div>
                    </div>

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
                                placeholder="Modern townhouse near the city centre"
                                aria-invalid={Boolean(errors.title)}
                                {...register("title")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.title && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.title.message}
                                </p>
                            )}
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
                                placeholder="Describe the property, surrounding area, and important rental details."
                                aria-invalid={Boolean(errors.description)}
                                {...register("description")}
                                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.description && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.description.message}
                                </p>
                            )}
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
                                aria-invalid={Boolean(errors.categoryId)}
                                {...register("categoryId")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-focus disabled:cursor-wait disabled:opacity-60"
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

                            {errors.categoryId && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.categoryId.message}
                                </p>
                            )}

                            {categoriesError && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    Property types could not be loaded. Refresh the page
                                    and try again.
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
                                    placeholder="2500"
                                    aria-invalid={Boolean(errors.price)}
                                    {...register("price")}
                                    className="h-12 w-full rounded-xl border border-border bg-background pl-8 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                                />
                            </div>

                            {errors.price && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                    <div className="flex items-start gap-3 border-b border-border pb-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                            <MapPin
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Location and dimensions
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Explain where the property is and how much space it
                                offers.
                            </p>
                        </div>
                    </div>

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
                                placeholder="Austin, Texas"
                                aria-invalid={Boolean(errors.location)}
                                {...register("location")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.location && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.location.message}
                                </p>
                            )}
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
                                placeholder="123 Cedar Street"
                                aria-invalid={Boolean(errors.address)}
                                {...register("address")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.address && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.address.message}
                                </p>
                            )}
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
                                placeholder="2"
                                aria-invalid={Boolean(errors.bedrooms)}
                                {...register("bedrooms")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.bedrooms && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.bedrooms.message}
                                </p>
                            )}
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
                                placeholder="1"
                                aria-invalid={Boolean(errors.bathrooms)}
                                {...register("bathrooms")}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.bathrooms && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.bathrooms.message}
                                </p>
                            )}
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
                                    placeholder="1200"
                                    aria-invalid={Boolean(errors.area)}
                                    {...register("area")}
                                    className="h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                                />
                            </div>

                            {errors.area && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.area.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-7">
                    <div className="flex items-start gap-3 border-b border-border pb-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-brand">
                            <Sparkles
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>

                        <div>
                            <h2 className="font-semibold text-foreground">
                                Amenities and images
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Add useful property features and externally hosted
                                images.
                            </p>
                        </div>
                    </div>

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
                                placeholder="Parking, Wi-Fi, Air conditioning&#10;Separate amenities with commas or new lines."
                                aria-invalid={Boolean(errors.amenities)}
                                {...register("amenities")}
                                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                            />

                            {errors.amenities && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.amenities.message}
                                </p>
                            )}
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
                                    placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
                                    aria-invalid={Boolean(errors.imageUrls)}
                                    {...register("imageUrls")}
                                    className="w-full resize-y rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                                />
                            </div>

                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                                Enter one HTTP or HTTPS image URL per line.
                            </p>

                            {errors.imageUrls && (
                                <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                                    {errors.imageUrls.message}
                                </p>
                            )}
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
                            createPropertyMutation.isPending ? (
                            <>
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="size-4 animate-spin"
                                />
                                Creating property...
                            </>
                        ) : (
                            <>
                                <Building2
                                    aria-hidden="true"
                                    className="size-4"
                                />
                                Create property
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}