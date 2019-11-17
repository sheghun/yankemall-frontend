import {createContext, Dispatch, SetStateAction} from 'react';

const userObject = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: [],
    gender: '',
    payments: [],
    orders: [],
    birthDate: '',
};
export const DashboardContext = createContext({
    ...userObject,
    setUserObject: (() => {}) as Dispatch<SetStateAction<User>>,
} as DashboardContext);

const adminObject: AdminContext = {
    users: [],
    orders: [],
    exchangeRate: 0,
};

export const AdminContext = createContext({
    ...adminObject,
    setAdminObject: (() => {}) as Dispatch<SetStateAction<AdminContext>>,
});
