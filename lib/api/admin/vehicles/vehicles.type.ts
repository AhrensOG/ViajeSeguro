export interface Vehicle {
    id: string;
    plate: string;
    capacity: number;
    serviceType: ServiceType;
    provider: Provider;
    allowSeatSelection: boolean;
    model: string;
    brand: string;
    year: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features: string[];
    images: string[];
    ownerId: string;
    approvalStatus: VehicleApprovalStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
    owner?: {
        id: string;
        name: string;
        lastName: string;
        email: string;
    };

    seats: {
        id: string;
        code: string;
        row: number;
        column: number;
    }[];

    trips: {
        id: string;
        origin: string;
        destination: string;
        departure: string; // o Date
        arrival: string; // o Date
    }[];
}

export interface CreateVehicleDto {
    plate: string;
    capacity: number;
    serviceType: ServiceType;
    provider: Provider;
    allowSeatSelection: boolean;
    ownerId: string;
    model: string;
    brand: string;
    year: number;
    fuelType: "DIESEL" | "GASOLINE" | "ELECTRIC" | "HYBRID";
    transmissionType: "MANUAL" | "AUTOMATIC";
    features?: FeatureEnum[];
    images?: string[];
}

export enum ServiceType {
    SIMPLE_TRIP,
    RENTAL_WITH_DRIVER,
    RENTAL_WITHOUT_DRIVER,
}

export enum Provider {
    PRIVATE = "PRIVATE",
    VS = "VS",
}

export enum VehicleApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum FeatureEnum {
    GPS = "GPS",
    AIR_CONDITIONING = "AIR_CONDITIONING",
    BLUETOOTH = "BLUETOOTH",
    REAR_CAMERA = "REAR_CAMERA",
}
