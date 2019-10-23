import React from 'react';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import {Route} from 'react-router';

const SignIn = loadable(() => import('../Views/Admin/Signin'), {
    fallback: <Loading show={true} />,
});
const NotFound = loadable(() => import('../Views/404'), {
    fallback: <Loading show={true} />,
});

const Admin = () => {
    return (
        <>
            <Route path={'/superAdmin/signin'} component={SignIn} />
        </>
    );
};

export default Admin;
