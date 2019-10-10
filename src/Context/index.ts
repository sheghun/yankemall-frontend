import {createContext} from 'react';

export const DashboardContext = createContext({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: [],
    gender: '',
    birthDate: '',
} as DashboardContext);
