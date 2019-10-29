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

const Overview = loadable(() => import('../Views/Admin/Overview'), {
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

    const [adminObject, setAdminObject] = useState({
        users: [],
        orders: [],
        exchangeRate: 0,
    } as AdminContext);

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
                    const users = data.data.users as Array<User>;
                    const orders = users.flatMap(user => user.orders);
                    setAdminObject(s => ({...s, users, orders}));
                }
            } catch (e) {}
        })();
        (async () => {
            try {
                const {status, data} = await Axios.get('/admin/exchangeRate');
                if (status === 200 && data.status === 'success') {
                    setAdminObject(s => ({...s, exchangeRate: data.data.exchangeRate}));
                }
            } catch (e) {}
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
                        <Grid item md={8}>
                            <Route path={'/superAdmin/tl/overview'} component={Overview} />
                        </Grid>
                    </Grid>
                    <Footer />
                </div>
            </AdminContext.Provider>
        </>
    );
};

export default Admin;
