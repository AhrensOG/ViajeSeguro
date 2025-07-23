export interface Vehicle {
    id: string;
    plate: string;
    capacity: number;
    serviceType: ServiceType;
    provider: Provider;
    allowSeatSelection: boolean;
    ownerId: string;
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
}

export interface ServiceType {
    SIMPLE_TRIP: "SIMPLE_TRIP";
    RENTAL_WITH_DRIVER: "RENTAL_WITH_DRIVER";
    RENTAL_WITHOUT_DRIVER: "RENTAL_WITHOUT_DRIVER";
}

export interface Provider {
    VS: "VS";
    PRIVATE: "PRIVATE";
}
