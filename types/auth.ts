export type UserRole =
    | "TENANT"
    | "LANDLORD"
    | "ADMIN"

export type RegisterableRole =
    | "TENANT"
    | "LANDLORD"

export type UserStatus =
    | "ACTIVE"
    | "BANNED"

export type AuthUser = {
    id: string
    name: string
    email: string
    role: UserRole
    phone: string | null
    status: UserStatus
    createdAt?: string
    updatedAt?: string
}

export type LoginResult = {
    accessToken: string
    user: AuthUser
}