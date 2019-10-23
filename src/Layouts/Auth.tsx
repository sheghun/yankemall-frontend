import React from 'react';
import {Route, Switch} from 'react-router';
import loadable from '@loadable/component';
import Loading from '../components/loading';

const SignIn = loadable(() => import('../Views/Auth/Signin'), {
    fallback: <Loading show={true} />,
});
const Signup = loadable(() => import('../Views/Auth/Signup'), {
    fallback: <Loading show={true} />,
});
const ForgotPassword = loadable(() => import('../Views/Auth/ForgotPassword'), {
    fallback: <Loading show={true} />,
});

const Auth = () => {
    return (
        <>
            <Switch>
                <Route path={'/auth/signin'} component={SignIn} />
                <Route path={'/auth/signup'} component={Signup} />
                <Route path={'/auth/forgotpass'} component={ForgotPassword} />
            </Switch>
        </>
    );
};

export default Auth;
