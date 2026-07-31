import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { requireUserRole } from "@/lib/auth/server-session";

type AdminLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function AdminLayout({
    children,
}: AdminLayoutProps) {
    const user = await requireUserRole("ADMIN");

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}