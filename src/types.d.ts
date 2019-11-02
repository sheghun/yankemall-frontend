// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="react" />

/**
 * The site interface
 * A representation of the site object at the backend
 */
declare interface Site {
    id: number;
    cartUrls: string[];
    categoryId: number;
    locationId: number;
    domains: string[];
    host: string;
    logo: string;
}

declare interface User {
    firstName: string;
    lastName: string;
    id: number;
    email: string;
    phoneNumber: string;
    address: Array<Address>;
    gender: string;
    orders: Array<Order>;
    birthDate: string;
}

/**
 * The category
 * A representation of the category object retrieved at the backend
 */
declare interface Category {
    id: number;
    title: string;
}
/**
 * The location
 * A representation of the location object retrieved at the backend
 */
declare interface Location {
    id: number;
    country: string;
}

declare interface Product {
    link: string;
    title: string;
    quantity: string;
    price: number;
    condition: string;
    image?: string;
}

declare interface DashboardContext {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: Array<Address>;
    gender: string;
    birthDate: string;
    setUserObject: Dispatch<SetStateAction<DashboardContext>>;
}

declare interface Address {
    id: number;
    default: boolean;
    region: string;
    state: string;
    userId: number;
    zipCode: string;
    address: string;
    firstName: string;
    phoneNumber: string;
    lastName: string;
}

declare interface AdminContext {
    users: Array<User>;
    orders: Array<Order>;
    exchangeRate: number;
}

declare interface Order {
    id: number;
    userId: number;
}
