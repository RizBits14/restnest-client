import type { UserRole } from "@/types/auth";

const dashboardPaths: Record<UserRole, string> = {
    TENANT: "/dashboard/tenant",
    LANDLORD: "/dashboard/landlord",
    ADMIN: "/dashboard/admin",
};

export function getDashboardPath(role: UserRole) {
    return dashboardPaths[role];
}