import {createContext, Dispatch, SetStateAction} from 'react';

interface UserObject {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: Array<Address>;
    gender: string;
    birthDate: string;
}
const userObject = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: [],
    gender: '',
    birthDate: '',
};
export const DashboardContext = createContext({
    ...userObject,
    setUserObject: (() => {}) as Dispatch<SetStateAction<UserObject>>,
} as DashboardContext);
