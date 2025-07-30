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
    type: string;
}
