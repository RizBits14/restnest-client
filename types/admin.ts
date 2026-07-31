import type {
    AuthUser,
    UserStatus,
} from "@/types/auth";
import type {
    Property,
    PropertyLandlord,
} from "@/types/property";

export type AdminUser = AuthUser & {
    createdAt: string;
    updatedAt: string;
};

export type UpdateAdminUserStatusInput = {
    userId: string;
    status: UserStatus;
};

export type AdminProperty = Omit<
    Property,
    "landlord"
> & {
    landlord: PropertyLandlord & {
        status: UserStatus;
    };
};