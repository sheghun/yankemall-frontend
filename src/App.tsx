import React, {useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import loadable from '@loadable/component';
import Home from './Views/Home';
import {ThemeProvider} from '@material-ui/styles';
import Loading from './components/loading';
import theme from './theme';
import Auth from './Layouts/Auth';
import Axios from 'axios';
import Snack from './components/snack';

const Checkout = loadable(() => import('./Views/Checkout'), {
    fallback: <Loading show={true} />,
});
const Dashboard = loadable(() => import('./Layouts/Dashboard'), {
    fallback: <Loading show={true} />,
});
const Admin = loadable(() => import('./Layouts/Admin'), {
    fallback: <Loading show={true} />,
});
const NotFound = loadable(() => import('./Views/404'), {
    fallback: <Loading show={true} />,
});

const App: React.FC = () => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });

    useEffect(() => {
        Axios.interceptors.response.use(
            response => Promise.resolve(response),
            err => {
                if (err.response) {
                    if (String(err.response.status).match(/^5/)) {
                        setSnackbar({
                            open: true,
                            variant: 'error',
                            message:
                                'An error occurred from our end please bear with us while we fix this',
                        });
                    }
                } else {
                    setSnackbar({
                        open: true,
                        variant: 'info',
                        message: 'Oops network error try again',
                    });
                }
                return Promise.reject(err);
            },
        );
    }, []);

    return (
        <>
            <ThemeProvider theme={theme}>
                <Snack
                    variant={snackbar.variant as any}
                    open={snackbar.open}
                    message={snackbar.message}
                    onClose={() => setSnackbar(s => ({...s, open: false}))}
                />
                <Switch>
                    <Route exact path={'/'} component={Home} />
                    <Route path={'/checkout'} component={Checkout} />
                    <Route path={'/auth/*'} component={Auth} />
                    <Route path={'/dashboard/*'} component={Dashboard} />
                    <Route path={'/superAdmin/*'} component={Admin} />
                    <Route component={NotFound} />
                </Switch>
            </ThemeProvider>
        </>
    );
};

export default App;
