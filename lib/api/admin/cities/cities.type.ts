export interface CityResponse {
    id: string;
    name: string;
    state: string;
    country: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCityRequest {
    name: string;
    state: string;
    country: string;
    isActive: boolean;
}

export interface UpdateCityRequest {
    name: string;
    state: string;
    country: string;
    isActive: boolean;
}
