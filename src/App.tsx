import React from 'react';
import {Route, Switch} from 'react-router-dom';
import loadable from '@loadable/component';
import Home from './pages/home';
import Loading from './components/loading';

const Checkout = loadable(() => import('./pages/checkout'), {
    fallback: <Loading show={true} />,
});

const App: React.FC = () => {
    return (
        <>
            <Switch>
                <Route exact path={'/'} component={Home} />
                <Route path={'/checkout'} component={Checkout} />
            </Switch>
        </>
    );
};

export default App;
