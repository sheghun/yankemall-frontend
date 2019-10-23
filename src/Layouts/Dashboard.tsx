import React, {useEffect, useState} from 'react';
import {Route, RouteComponentProps} from 'react-router';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import TopBar from '../components/topbar';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../components/Sidebar';
import logoImage from '../assets/images/pp.png';
import Footer from '../components/Footer';
import {DashboardContext} from '../Context';
import Axios, {AxiosError} from 'axios';
import Nav from '../components/nav';

const Overview = loadable(() => import('../Views/Dashboard/Overview'), {
    fallback: <Loading show={true} />,
});
const Orders = loadable(() => import('../Views/Dashboard/Orders'), {
    fallback: <Loading show={true} />,
});
const Details = loadable(() => import('../Views/Dashboard/Details'), {
    fallback: <Loading show={true} />,
});
const Address = loadable(() => import('../Views/Dashboard/Address'), {
    fallback: <Loading show={true} />,
});
const ChangePass = loadable(() => import('../Views/Dashboard/ChangePass'), {
    fallback: <Loading show={true} />,
});
const NotFound = loadable(() => import('../Views/404'), {
    fallback: <Loading show={true} />,
});

const useStyles = makeStyles(theme => ({
    body: {
        backgroundColor: '#F5F5F5',
        padding: theme.spacing(2),
        width: '100vw',
        height: '100vh',
    },
    logo: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem',
        '& img': {
            height: '100px',
        },
    },
}));

type Props = RouteComponentProps & {};

// Try getting the user details
const Dashboard = ({location, history}: Props) => {
    const classes = useStyles();

    const [userObject, setUserObject] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        address: [],
    });

    /**
     * Listen for 403 status error code and redirect to the login page
     */
    useEffect(() => {
        Axios.interceptors.response.use(
            response => Promise.resolve(response),
            error => {
                const err = error as AxiosError;
                if (err.response) {
                    if (err.response.status === 403) {
                        const queryParams = `?returnUrl=${
                            location.pathname
                        }&${location.search.replace('?', '')}`;
                        history.push(`/auth/signin${queryParams}`);
                    }
                }
                return Promise.reject(error);
            },
        );
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const {status, data} = await Axios.get('/user');
                if (status === 200 && data.status === 'success') {
                    setUserObject(data.data.data);
                }
            } catch (e) {}
        })();
    }, []);

    return (
        <>
            <DashboardContext.Provider value={{...userObject, setUserObject}}>
                <div style={{backgroundColor: 'white', padding: '.5rem 2rem'}}>
                    <Nav />
                </div>
                <div className={classes.body}>
                    <Grid container={true} justify={'center'} alignContent={'stretch'} spacing={2}>
                        <Grid item md={2}>
                            <Sidebar />
                        </Grid>
                        <Grid item md={8}>
                            <Route path={'/dashboard/overview'} component={Overview} />
                            <Route path={'/dashboard/orders'} component={Orders} />
                            <Route path={'/dashboard/details'} component={Details} />
                            <Route path={'/dashboard/address'} component={Address} />
                            <Route path={'/dashboard/changepass'} component={ChangePass} />
                        </Grid>
                    </Grid>
                    <Footer />
                </div>
            </DashboardContext.Provider>
        </>
    );
};

export default Dashboard;
