import React, {useEffect, useState} from 'react';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import {Route, RouteComponentProps} from 'react-router';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {makeStyles} from '@material-ui/core';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import AllInboxOutlinedIcon from '@material-ui/icons/AllInboxOutlined';
import Axios, {AxiosError} from 'axios';
import {AdminContext} from '../Context';
import PaymentIcon from '@material-ui/icons/Payment';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const Overview = loadable(() => import('../Views/Admin/Overview'), {
    fallback: <Loading show={true} />,
});

const Orders = loadable(() => import('../Views/Admin/Orders'), {
    fallback: <Loading show={true} />,
});

const Users = loadable(() => import('../Views/Admin/Users'), {
    fallback: <Loading show={true} />,
});
const Payments = loadable(() => import('../Views/Admin/Payments'), {
    fallback: <Loading show={true} />,
});

const links = [
    {
        path: '/superAdmin/tl/overview',
        text: 'Overview',
        icon: <HomeIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/superAdmin/tl/users',
        text: 'Users',
        icon: <PeopleAltOutlinedIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/superAdmin/tl/orders',
        text: 'Orders',
        icon: <AllInboxOutlinedIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/superAdmin/tl/payments',
        text: 'Payments',
        icon: <PaymentIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/superAdminLogout',
        text: 'Logout',
    },
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
}));

type Props = RouteComponentProps & {};

const Admin = ({history, location}: Props) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [adminObject, setAdminObject] = useState({
        users: [],
        orders: [],
        payments: [],
        exchangeRate: 0,
    } as AdminContext);

    /**
     * Listen for 403 status error code and redirect to the login page
     */
    useEffect(() => {
        const interceptorId = Axios.interceptors.response.use(
            response => Promise.resolve(response),
            error => {
                const err = error as AxiosError;
                if (err.response) {
                    const {pathname} = location;
                    console.log(pathname);
                    if (
                        err.response.status === 403 &&
                        pathname !== '/superAdmin/signin' &&
                        pathname !== '/superAdminLogout'
                    ) {
                        const queryParams = `?returnUrl=${
                            location.pathname
                        }&${location.search.replace('?', '')}`;
                        history.push(`/superAdmin/signin${queryParams}`);
                    }
                }
                return Promise.reject(error);
            },
        );

        return () => {
            Axios.interceptors.response.eject(interceptorId);
        };
    }, [history, location.pathname, location.search]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const {status, data} = await Axios.get('/admin/user');
                if (status === 200 && data.status === 'success') {
                    const users = data.data.users as Array<User>;
                    setAdminObject(ad => ({...ad, users: users || []}));
                }
            } catch (e) {}
            setLoading(false);
        })();

        (async () => {
            setLoading(true);
            try {
                const {status, data} = await Axios.get('/admin/orders');
                console.log(data);
                if (status === 200 && data.status === 'success') {
                    const orders = data.data.orders as Array<Order>;
                    const payments = orders.flatMap(order => order.payments);
                    setAdminObject(ad => ({
                        ...ad,
                        orders: orders || [],
                        payments: payments || [],
                    }));
                }
            } catch (e) {}
            setLoading(false);
        })();

        (async () => {
            setLoading(true);
            try {
                const {status, data} = await Axios.get('/admin/exchangeRate');
                if (status === 200 && data.status === 'success') {
                    const {exchangeRate} = data.data as {exchangeRate: number};
                    setAdminObject(a => ({...a, exchangeRate: exchangeRate || 0}));
                }
            } catch (e) {}
            setLoading(false);
        })();
    }, []);

    return (
        <>
            <AdminContext.Provider value={{...adminObject, setAdminObject}}>
                <div className={classes.body}>
                    <Grid container={true} justify={'center'} alignContent={'stretch'} spacing={2}>
                        <Grid item md={2}>
                            <Sidebar links={links} />
                        </Grid>
                        <Grid item md={8} xs={12}>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <Route path={'/superAdmin/tl/overview'} component={Overview} />
                                    <Route path={'/superAdmin/tl/orders'} component={Orders} />
                                    <Route path={'/superAdmin/tl/users'} component={Users} />
                                    <Route path={'/superAdmin/tl/payments'} component={Payments} />
                                </>
                            )}
                        </Grid>
                    </Grid>
                    <Footer />
                </div>
            </AdminContext.Provider>
        </>
    );
};

export default Admin;
