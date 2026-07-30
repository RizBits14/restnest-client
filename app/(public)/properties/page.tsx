import type { Metadata } from "next";

import { PropertiesBrowser } from "@/components/properties/properties-browser";

export const metadata: Metadata = {
    title: "Properties",
    description:
        "Browse available rental properties on RESTNEST.",
};

export default function PropertiesPage() {
    return (
        <main>
            <PropertiesBrowser />
        </main>
    );
}