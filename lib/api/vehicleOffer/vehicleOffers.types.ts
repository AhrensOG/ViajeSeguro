export interface FormData {
    price: number;
    agency_fee: number;
    withdraw_location: string;
    return_location: string;
    start_date: string;
    end_date: string;
    vehicle: string;
    conditions: string;
}

export interface VehicleOfferSearch {
    withdrawLocation: string;
    capacity: number;
    vehicleOfferType: string;
    availableFrom: string;
    availableTo: string;
}

export interface VehicleOfferResponse {
    id: string;
    pricePerDay: number;
    withdrawLocation: string;
    returnLocation: string;
    originalTimeZone: string;
    availableFrom: Date;
    availableTo: Date;
    agencyFee: number;
    available: string;
    vehicle: {
        id: string;
        capacity: number;
    };
}

export interface CardReservationVehicleOfferProps {
    id: string;
    imageUrl: string[];
    title: string;
    capacity: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features: string[];
    whitdrawLocation: string;
    returnLocation: string;
    dateStart: string;
    dateEnd: string;
    // totalPrice: string;
    pricePerDay: number;
    dailyMileageLimit?: number;
    vehicleOfferType: string;
    requestedStartDate: string;
    requestedEndDate: string;
    requestedOfferType: string;
    requestedCapacity: number;
}
