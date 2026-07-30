import { apiRequest } from "@/lib/api/api-client";
import type {
    Property,
    PropertyStatus,
} from "@/types/property";

export type PropertyFilters = {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    status?: PropertyStatus;
};

function createPropertyQuery(filters: PropertyFilters) {
    const searchParams = new URLSearchParams();

    if (filters.location?.trim()) {
        searchParams.set("location", filters.location.trim());
    }

    if (filters.minPrice !== undefined) {
        searchParams.set("minPrice", String(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
        searchParams.set("maxPrice", String(filters.maxPrice));
    }

    if (filters.categoryId) {
        searchParams.set("categoryId", filters.categoryId);
    }

    if (filters.status) {
        searchParams.set("status", filters.status);
    }

    return searchParams.toString();
}

export async function getProperties(
    filters: PropertyFilters = {},
) {
    const query = createPropertyQuery(filters);
    const endpoint = query
        ? `/properties?${query}`
        : "/properties";

    const response = await apiRequest<Property[]>(endpoint, {
        method: "GET",
    });

    return response.data ?? [];
}