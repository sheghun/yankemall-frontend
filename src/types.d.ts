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
