import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type PublicLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <a
                href="#main-content"
                className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-brand-foreground shadow-raised transition-transform duration-200 focus:translate-y-0"
            >
                Skip to main content
            </a>

            <SiteHeader />

            <main
                id="main-content"
                className="flex-1"
            >
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}