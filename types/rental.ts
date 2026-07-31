import type {
    LandlordProperty,
    Property,
} from "@/types/property";

export type RentalStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

export type RentalDecision =
    | "APPROVED"
    | "REJECTED";

export type RentalTenant = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
};

export type PaymentStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED";

export type PaymentProvider =
    | "STRIPE"
    | "SSLCOMMERZ";

export type RentalPayment = {
    id: string;
    transactionId: string | null;
    amount: number;
    provider: PaymentProvider;
    status: PaymentStatus;
    paymentUrl: string | null;
    paidAt: string | null;
    rentalRequestId: string;
    createdAt: string;
    updatedAt: string;
};

export type LandlordRentalRequest = {
    id: string;
    message: string | null;
    moveInDate: string;
    duration: number;
    status: RentalStatus;
    tenantId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;
    tenant: RentalTenant;
    property: LandlordProperty;
    payment: RentalPayment | null;
};

export type UpdateRentalRequestInput = {
    status: RentalDecision;
};

export type CreateRentalRequestInput = {
    propertyId: string;
    moveInDate: string;
    duration: number;
    message?: string;
};

export type RentalReview = {
    id: string;
    rating: number;
    comment: string | null;
    tenantId: string;
    propertyId: string;
    rentalRequestId: string;
    createdAt: string;
    updatedAt: string;
};

export type TenantRentalRequest = {
    id: string;
    message: string | null;
    moveInDate: string;
    duration: number;
    status: RentalStatus;
    tenantId: string;
    propertyId: string;
    createdAt: string;
    updatedAt: string;
    property: Property;
    payment: RentalPayment | null;
    review: RentalReview | null;
};