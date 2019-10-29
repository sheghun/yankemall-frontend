import React, {useEffect} from 'react';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import {Route, RouteComponentProps} from 'react-router';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import {makeStyles} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/PersonOutline';
import OrderIcon from '@material-ui/icons/AllInbox';
import Axios, {AxiosError} from 'axios';

const SignIn = loadable(() => import('../Views/Admin/Signin'), {
    fallback: <Loading show={true} />,
});
const Overview = loadable(() => import('../Views/Admin/Overview'), {
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
    {path: '/dashboard/details', text: 'Details'},
    {path: '/dashboard/changepass', text: 'Change Password'},
    {path: '/dashboard/address', text: 'Address'},
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

    /**
     * Listen for 403 status error code and redirect to the login page
     */
    useEffect(() => {
        Axios.interceptors.response.use(
            response => Promise.resolve(response),
            error => {
                const err = error as AxiosError;
                if (err.response) {
                    if (err.response.status === 403 && location.pathname !== '/superAdmin/signin') {
                        const queryParams = `?returnUrl=${
                            location.pathname
                        }&${location.search.replace('?', '')}`;
                        history.push(`/superAdmin/signin${queryParams}`);
                    }
                }
                return Promise.reject(error);
            },
        );
    }, [history, location.pathname, location.search]);

    useEffect(() => {
        (async () => {
            try {
                const {status, data} = await Axios.get('/admin/users');
                if (status === 200 && data.status === 'success') {
                    console.log(data.data.users);
                }
            } catch (e) {}
        })();
    }, []);

    return (
        <>
            <Route path={'/superAdmin/signin'} component={SignIn} />
            <div className={classes.body}>
                <Grid container={true} justify={'center'} alignContent={'stretch'} spacing={2}>
                    <Grid item md={2}>
                        <Sidebar links={links} />
                    </Grid>
                    <Grid item md={8}>
                        <Route path={'/superAdmin/tl/overview'} component={Overview} />
                    </Grid>
                </Grid>
                <Footer />
            </div>
        </>
    );
};

export default Admin;
