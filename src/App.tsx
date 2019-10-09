import React from 'react';
import {Route, Switch} from 'react-router-dom';
import loadable from '@loadable/component';
import Home from './Views/Home';
import {ThemeProvider} from '@material-ui/styles';
import Loading from './components/loading';
import theme from './theme';
import Auth from './Layouts/Auth';

const Checkout = loadable(() => import('./Views/Checkout'), {
    fallback: <Loading show={true} />,
});
const Dashboard = loadable(() => import('./Layouts/Dashboard'), {
    fallback: <Loading show={true} />,
});

const App: React.FC = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route exact path={'/'} component={Home} />
                    <Route path={'/checkout'} component={Checkout} />
                    <Route path={'/auth'} component={Auth} />
                    <Route path={'/dashboard'} component={Dashboard} />
                </Switch>
            </ThemeProvider>
        </>
    );
};

export default App;
