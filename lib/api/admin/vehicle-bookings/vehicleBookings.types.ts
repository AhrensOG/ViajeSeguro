export interface VehicleBookingResponseAdmin {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    offerId: string;
    renterId: string;
    offer: {
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
            plate: string;
        };
    };
    renter: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };
}

export interface SimpleOffer {
    id: string;
    withdrawLocation: string;
    returnLocation: string;
    availableFrom: Date;
    availableTo: Date;
    originalTimeZone: string;
    pricePerDay: number;
    vehicleOfferType: string;
    conditions: string;
    ownerId: string;
    vehicle: {
        id: string;
        capacity: number;
        model: string;
        brand: string;
        year: number;
    };
}

export interface SimpleUser {
    id: string;
    name: string;
    lastName: string;
    email: string;
}

export interface CreateVehicleBookingRequest {
    renterId: string;
    offerId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: string;
    referralId?: string;
    paymentMethod?: string;
}

export interface SimpleVehicle {
    id: string;
    capacity: number;
    model: string;
    brand: string;
    year: number;
    plate: string;
}
