import { createPropertyPayload } from "@/lib/properties/create-property-payload";
import type { EditPropertyFormValues } from "@/lib/validation/property-schema";
import type { UpdatePropertyInput } from "@/types/property";

export function createUpdatePropertyPayload(
    values: EditPropertyFormValues,
): UpdatePropertyInput {
    return {
        ...createPropertyPayload(values),
        status: values.status,
    };
}