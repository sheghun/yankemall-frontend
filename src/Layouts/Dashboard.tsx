import React, {useEffect, useState} from 'react';
import {Route, RouteComponentProps} from 'react-router';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {DashboardContext} from '../Context';
import Axios, {AxiosError} from 'axios';
import Nav from '../components/nav';
import PersonIcon from '@material-ui/icons/PersonOutline';
import OrderIcon from '@material-ui/icons/AllInbox';
import PaymentIcon from '@material-ui/icons/Payment';
import CircularProgress from '@material-ui/core/CircularProgress';

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
const Payments = loadable(() => import('../Views/Dashboard/Payments'), {
    fallback: <Loading show={true} />,
});

const links = [
    {
        path: '/dashboard/overview',
        text: 'My Account',
        icon: <PersonIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/dashboard/orders',
        text: 'Orders',
        icon: <OrderIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/dashboard/payments',
        text: 'Payments',
        icon: <PaymentIcon style={{marginRight: '1rem'}} />,
    },
    {path: '/dashboard/details', text: 'Details'},
    {path: '/dashboard/changepass', text: 'Change Password'},
    {path: '/dashboard/address', text: 'Address'},
    {path: '/logout', text: 'Logout'},
];

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
    main: {
        [theme.breakpoints.down('sm')]: {
            marginTop: '-4rem',
        },
    },
}));

type Props = RouteComponentProps & {};

// Try getting the user details
const Dashboard = ({location, history}: Props) => {
    const classes = useStyles();

    const [userObject, setUserObject] = useState({
        id: 0,
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        orders: [],
        payments: [],
        address: [],
        setUserObject: (() => {}) as any,
    } as DashboardContext);

    const [loading, setLoading] = useState(false);

    /**
     * Listen for 403 status error code and redirect to the login page
     */
    useEffect(() => {
        const interceptorId = Axios.interceptors.response.use(
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
        return () => {
            Axios.interceptors.response.eject(interceptorId);
        };
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const {status, data} = await Axios.get('/user');
                if (status === 200 && data.status === 'success') {
                    if (data.data.data === null) {
                        const queryParams = `?returnUrl=${
                            location.pathname
                        }&${location.search.replace('?', '')}`;
                        history.push(`/auth/signin${queryParams}`);
                        return;
                    }
                    setUserObject(oldObj => ({
                        ...oldObj,
                        ...data.data.data,
                        payments: data.data.data.orders.flatMap((order: Order) => order.payments),
                    }));
                }
            } catch (e) {}
            setLoading(false);
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
                            <Sidebar links={links} />
                        </Grid>
                        <Grid item md={8} className={classes.main}>
                            {loading ? (
                                <div style={{margin: 'auto 0 auto'}}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    <Route path={'/dashboard/overview'} component={Overview} />
                                    <Route path={'/dashboard/orders'} component={Orders} />
                                    <Route path={'/dashboard/details'} component={Details} />
                                    <Route path={'/dashboard/address'} component={Address} />
                                    <Route path={'/dashboard/changepass'} component={ChangePass} />
                                    <Route path={'/dashboard/payments'} component={Payments} />
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Footer />
                </div>
            </DashboardContext.Provider>
        </>
    );
};

export default Dashboard;
