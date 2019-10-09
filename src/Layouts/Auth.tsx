import React from 'react';
import {Route, Switch} from 'react-router';
import loadable from '@loadable/component';
import Loading from '../components/loading';

const SignIn = loadable(() => import('../Views/Auth/Signin'), {
    fallback: <Loading show={true} />,
});

const Auth = () => {
    return (
        <>
            <Switch>
                <Route path={'/auth/signin'} component={SignIn} />
            </Switch>
        </>
    );
};

export default Auth;
