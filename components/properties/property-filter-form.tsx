"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronDown,
    CircleDollarSign,
    LoaderCircle,
    MapPin,
    RotateCcw,
    Search,
} from "lucide-react";
import { useForm } from "react-hook-form";

import {
    propertyFilterSchema,
    type PropertyFilterFormValues,
} from "@/lib/validation/property-filter-schema";
import type { PropertyCategory } from "@/types/property";

type PropertyFilterFormProps = Readonly<{
    categories: PropertyCategory[];
    isCategoriesLoading: boolean;
    categoryErrorMessage?: string;
    isUpdating: boolean;
    onApply: (values: PropertyFilterFormValues) => void;
    onReset: () => void;
}>;

const defaultValues: PropertyFilterFormValues = {
    location: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
};

const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-border-strong focus:border-focus focus:ring-4 focus:ring-focus/10 disabled:cursor-wait disabled:opacity-60";

const errorInputClassName =
    "border-danger focus:border-danger focus:ring-danger/10";

export function PropertyFilterForm({
    categories,
    isCategoriesLoading,
    categoryErrorMessage,
    isUpdating,
    onApply,
    onReset,
}: PropertyFilterFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PropertyFilterFormValues>({
        resolver: zodResolver(propertyFilterSchema),
        defaultValues,
    });

    function handleReset() {
        reset(defaultValues);
        onReset();
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onApply)}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_0.78fr_0.78fr_auto] xl:items-start"
        >
            <div>
                <label
                    htmlFor="property-location"
                    className="mb-2 block text-sm font-bold text-foreground"
                >
                    Location
                </label>

                <div className="relative">
                    <MapPin
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                    />

                    <input
                        id="property-location"
                        type="text"
                        placeholder="City or area"
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={
                            errors.location
                                ? "property-location-error"
                                : undefined
                        }
                        {...register("location")}
                        className={[
                            inputClassName,
                            "pl-10 pr-3",
                            errors.location ? errorInputClassName : "",
                        ].join(" ")}
                    />
                </div>

                {errors.location && (
                    <p
                        id="property-location-error"
                        role="alert"
                        className="mt-2 text-sm font-medium text-danger"
                    >
                        {errors.location.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="property-category"
                    className="mb-2 block text-sm font-bold text-foreground"
                >
                    Property type
                </label>

                <div className="relative">
                    <select
                        id="property-category"
                        disabled={isCategoriesLoading}
                        aria-describedby={
                            categoryErrorMessage
                                ? "property-category-error"
                                : undefined
                        }
                        {...register("categoryId")}
                        className={[
                            inputClassName,
                            "appearance-none px-3 pr-10",
                            categoryErrorMessage
                                ? errorInputClassName
                                : "",
                        ].join(" ")}
                    >
                        <option value="">
                            {isCategoriesLoading
                                ? "Loading property types..."
                                : "All property types"}
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

                    {isCategoriesLoading ? (
                        <LoaderCircle
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-brand"
                        />
                    ) : (
                        <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                    )}
                </div>

                {categoryErrorMessage && (
                    <p
                        id="property-category-error"
                        role="alert"
                        className="mt-2 text-sm font-medium text-danger"
                    >
                        {categoryErrorMessage}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="minimum-price"
                    className="mb-2 block text-sm font-bold text-foreground"
                >
                    Minimum price
                </label>

                <div className="relative">
                    <CircleDollarSign
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                    />

                    <input
                        id="minimum-price"
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="0"
                        aria-invalid={Boolean(errors.minPrice)}
                        aria-describedby={
                            errors.minPrice
                                ? "minimum-price-error"
                                : undefined
                        }
                        {...register("minPrice")}
                        className={[
                            inputClassName,
                            "pl-10 pr-3",
                            errors.minPrice ? errorInputClassName : "",
                        ].join(" ")}
                    />
                </div>

                {errors.minPrice && (
                    <p
                        id="minimum-price-error"
                        role="alert"
                        className="mt-2 text-sm font-medium text-danger"
                    >
                        {errors.minPrice.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="maximum-price"
                    className="mb-2 block text-sm font-bold text-foreground"
                >
                    Maximum price
                </label>

                <div className="relative">
                    <CircleDollarSign
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-accent"
                    />

                    <input
                        id="maximum-price"
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="Any"
                        aria-invalid={Boolean(errors.maxPrice)}
                        aria-describedby={
                            errors.maxPrice
                                ? "maximum-price-error"
                                : undefined
                        }
                        {...register("maxPrice")}
                        className={[
                            inputClassName,
                            "pl-10 pr-3",
                            errors.maxPrice ? errorInputClassName : "",
                        ].join(" ")}
                    />
                </div>

                {errors.maxPrice && (
                    <p
                        id="maximum-price-error"
                        role="alert"
                        className="mt-2 text-sm font-medium text-danger"
                    >
                        {errors.maxPrice.message}
                    </p>
                )}
            </div>

            <div className="flex gap-2 md:col-span-2 xl:col-span-1 xl:pt-7">
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-brand-foreground transition-colors duration-200 hover:bg-brand-hover active:bg-brand-active disabled:cursor-wait disabled:opacity-60 xl:flex-none"
                >
                    {isUpdating ? (
                        <LoaderCircle
                            aria-hidden="true"
                            className="size-4 animate-spin"
                        />
                    ) : (
                        <Search
                            aria-hidden="true"
                            className="size-4"
                        />
                    )}

                    {isUpdating ? "Updating" : "Apply filters"}
                </button>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={isUpdating}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-muted-foreground transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60"
                >
                    <RotateCcw
                        aria-hidden="true"
                        className="size-4"
                    />

                    <span className="sm:hidden xl:hidden 2xl:inline">
                        Reset
                    </span>
                </button>
            </div>
        </form>
    );
}