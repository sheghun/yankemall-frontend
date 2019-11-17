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
    payments: Array<Payment>;
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
    dollar: number;
    naira: number;
    price: number;
    properties: string;
    condition: string;
    image?: string;
}

declare interface DashboardContext extends User {
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
    payments: Array<Payments>;
    exchangeRate: number;
}

declare interface Order {
    id: number;
    siteId: number;
    status: string;
    shippingFee: number;
    userId: number;
    total: number;
    dollar: number;
    paid: Date | null;
    products: Array<OrderProduct>;
    addressId: number;
    payments: Array<Payment>;
    createdAt: Date;
    updatedAt: Date;
}

declare interface OrderProduct {
    id: number;
    name: string;
    link: string;
    image: string;
    trackingNumber: string;
    trackingLink: string;
    status: 'paid' | 'shipped' | 'canceled';
    quantity: string;
    site: string;
    naira: number;
    dollar: number;
    orderId: number;
}

declare interface Payment {
    id: number;
    description: string;
    reference: string;
    paid: string;
    amount: number;
    dollar: number;
    exchangeRate: number;
    orderId: number;
    createdAt: string;
}
