export interface Vehicle {
    id: string;
    model: string;
    brand: string;
    capacity: number;
    year: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features: string[];
    images: string[];
}

export interface VehicleOfferWithVehicle {
    id: string;
    pricePerDay: number;
    availableFrom: string;
    availableTo: string;
    originalTimeZone: string;
    vehicle?: Vehicle;
    withdrawLocation: string;
    returnLocation: string;
    vehicleOfferType: string;
}

export interface CreateVehicleBookingPayload {
    renterId: string;
    offerId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    paymentMethod: string;
    referrerId?: string;
    totalPrice: number;
}

export interface ResponseForQrPage {
    id: string;
    startDate: Date;
    endDate: Date;
    status: "PENDING" | "APPROVED" | "COMPLETED" | "FINISHED" | "DECLINED" | "CANCELLED";
    isDeleted: boolean;
    paymentMethod: "CASH" | "STRIPE";
    offer: {
        id: string;
        withdrawLocation: string;
        returnLocation: string;
        pricePerDay: number;
        vehicleOfferType: "WITH_DRIVER" | "WITHOUT_DRIVER";
        originalTimeZone: string;
    };
    qrCode: {
        id: string;
        isValid: boolean;
        usedAt: Date | null;
        vehicleBookingId: string;
        imageUrl: string;
        createdAt: Date;
    }[];
    renter: {
        id: string;
        name: string;
        lastName: string;
        email: string;
        emailVerified: boolean;
        avatarUrl?: string;
        createdAt: Date;
    };
}
