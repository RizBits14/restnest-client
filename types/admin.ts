import type {
    AuthUser,
    UserStatus,
} from "@/types/auth";

export type AdminUser = AuthUser & {
    createdAt: string;
    updatedAt: string;
};

export type UpdateAdminUserStatusInput = {
    userId: string;
    status: UserStatus;
};