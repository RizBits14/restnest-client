import { DashboardShell } from "@/app/dashboard/dashboard-shell";
import { requireUserRole } from "@/lib/auth/server-session";

type LandlordLayoutProps = Readonly<{
    children: React.ReactNode;
}>;

export default async function LandlordLayout({
    children,
}: LandlordLayoutProps) {
    const user = await requireUserRole("LANDLORD");

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}