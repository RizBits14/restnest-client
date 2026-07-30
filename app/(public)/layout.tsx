import { SiteHeader } from "@/components/layout/site-header";

type PublicLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <div className="min-h-svh">
            <SiteHeader />
            {children}
        </div>
    );
}