export type PropertyStatus =
    | "AVAILABLE"
    | "RENTED"
    | "UNAVAILABLE"

export type PropertyCategory = {
    id: string
    name: string
    description: string | null
    createdAt: string
    updatedAt: string
}

export type PropertyLandlord = {
    id: string
    name: string
    email: string
    phone: string | null
}

export type Property = {
    id: string
    title: string
    description: string
    location: string
    address: string | null
    price: number
    bedrooms: number
    bathrooms: number
    area: number | null
    amenities: string[]
    images: string[]
    status: PropertyStatus
    landlordId: string
    categoryId: string
    createdAt: string
    updatedAt: string
    category: PropertyCategory
    landlord: PropertyLandlord
}