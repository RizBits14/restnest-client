"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Filter,
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
            onSubmit={handleSubmit(onApply)}
            className="rounded-[1.75rem] border border-border bg-surface p-5 sm:p-6"
        >
            <div className="flex items-center gap-3 border-b border-border pb-5">
                <span className="grid size-10 place-items-center rounded-xl bg-surface-muted text-brand">
                    <Filter aria-hidden="true" className="size-5" />
                </span>

                <div>
                    <h2 className="font-semibold text-foreground">
                        Refine your search
                    </h2>

                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Narrow the listings using the details that matter.
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-[1.35fr_1fr_0.75fr_0.75fr_auto] xl:items-start">
                <div>
                    <label
                        htmlFor="property-location"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Location
                    </label>

                    <div className="relative">
                        <MapPin
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />

                        <input
                            id="property-location"
                            type="text"
                            placeholder="City or area"
                            aria-invalid={Boolean(errors.location)}
                            {...register("location")}
                            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                        />
                    </div>

                    {errors.location && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.location.message}
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
                        disabled={isCategoriesLoading}
                        {...register("categoryId")}
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-focus disabled:cursor-wait disabled:opacity-60"
                    >
                        <option value="">
                            {isCategoriesLoading
                                ? "Loading types..."
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

                    {categoryErrorMessage && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {categoryErrorMessage}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="minimum-price"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Minimum price
                    </label>

                    <input
                        id="minimum-price"
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="$0"
                        aria-invalid={Boolean(errors.minPrice)}
                        {...register("minPrice")}
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                    />

                    {errors.minPrice && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.minPrice.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="maximum-price"
                        className="mb-2 block text-sm font-medium text-foreground"
                    >
                        Maximum price
                    </label>

                    <input
                        id="maximum-price"
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="Any"
                        aria-invalid={Boolean(errors.maxPrice)}
                        {...register("maxPrice")}
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-focus"
                    />

                    {errors.maxPrice && (
                        <p className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                            {errors.maxPrice.message}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 xl:pt-7">
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-wait disabled:opacity-60 xl:flex-none"
                    >
                        <Search aria-hidden="true" className="size-4" />
                        {isUpdating ? "Updating..." : "Apply"}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isUpdating}
                        aria-label="Clear property filters"
                        className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors duration-200 hover:bg-surface-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60"
                    >
                        <RotateCcw aria-hidden="true" className="size-4" />
                    </button>
                </div>
            </div>
        </form>
    );
}