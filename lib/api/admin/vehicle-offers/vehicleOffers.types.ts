export interface VehicleOffersAdminResponse {
    id: string;
    pricePerDay: number;
    withdrawLocation: string;
    returnLocation: string;
    originalTimeZone: string;
    availableFrom: Date;
    availableTo: Date;
    agencyFee: number;
    available: string;
    vehicleOfferType: string;
    conditions: string;
    vehicle: {
        id: string;
        capacity: number;
        model: string;
        brand: string;
        year: number;
        fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
        transmissionType: "MANUAL" | "AUTOMATIC";
        features: string[];
        images: string[];
        plate: string;
        ownerId: string;
    };
    owner: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };
    bookings: {
        id: string;
        totalPrice: number;
        createdAt: string;
        status: "PENDING" | "CONFIRMED" | "CANCELLED";
        renter: {
            id: string;
            name: string;
            lastName: string;
            email: string;
        };
    }[];
}

export interface SimpleVehicle {
    id: string;
    plate: string;
    capacity: number;
    serviceType: string;
    provider: string;
    model: string;
    brand: string;
    year: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features: string[];
    images: string[];
    ownerId: string;
}

export interface SimpleUser {
    id: string;
    name: string;
    lastName: string;
    email: string;
    role: "ADMIN" | "CLIENT" | "DRIVER" | "PARTNER";
    emailVerified?: boolean;
}

export interface CreateVehicleOfferRequest {
    pricePerDay: number;
    withdrawLocation: string;
    returnLocation: string;
    originalTimeZone: string;
    availableFrom: Date;
    availableTo: Date;
    agencyFee: number;
    available: string;
    vehicleOfferType: string;
    conditions?: string;
    ownerId?: string;
    vehicleId: string;
}
