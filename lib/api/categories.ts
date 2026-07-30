import { apiRequest } from "@/lib/api/api-client";
import type { PropertyCategory } from "@/types/property";

export async function getCategories() {
    const response = await apiRequest<PropertyCategory[]>("/categories", {
        method: "GET",
    });

    return response.data ?? [];
}