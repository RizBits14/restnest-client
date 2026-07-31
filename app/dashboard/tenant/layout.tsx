import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { requireUserRole } from "@/lib/auth/server-session";

type TenantLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function TenantLayout({
    children,
}: TenantLayoutProps) {
    const user = await requireUserRole("TENANT");

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}