interface Company {
    name: string;
    catchphrase: string;
    bs: string;
}

interface GeoLocation {
    lat: string;
    lng: string;
}

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: GeoLocation;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
