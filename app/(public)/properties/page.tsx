import type { Metadata } from "next";

import { PropertiesBrowser } from "@/components/properties/properties-browser";

export const metadata: Metadata = {
    title: "Browse Properties",
    description:
        "Explore available rental homes on RESTNEST and filter listings by location, category, price, and property features.",
};

export default function PropertiesPage() {
    return <PropertiesBrowser />;
}