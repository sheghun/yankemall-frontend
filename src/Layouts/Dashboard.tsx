import React from 'react';
import {Route, RouteComponentProps} from 'react-router';
import loadable from '@loadable/component';
import Loading from '../components/loading';
import TopBar from '../components/topbar';
import {makeStyles} from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar';
import Grid from '@material-ui/core/Grid';
import Footer from '../components/Footer';

const Overview = loadable(() => import('../Views/Dashboard/Overview'), {
    fallback: <Loading show={true} />,
});

const useStyles = makeStyles(theme => ({
    body: {
        backgroundColor: '#F5F5F5',
        padding: theme.spacing(2),
        width: '100vw',
        height: '100vh',
    },
}));

type Props = RouteComponentProps & {};

const Dashboard = ({}: Props) => {
    const classes = useStyles();
    return (
        <>
            <div style={{backgroundColor: 'white', padding: '.5rem 2rem'}}>
                <TopBar />
            </div>
            <div className={classes.body}>
                <Grid container={true} justify={'center'} alignContent={'stretch'} spacing={2}>
                    <Grid item md={3}>
                        <Sidebar />
                    </Grid>
                    <Grid item md={8}>
                        <Route path={'/dashboard/overview'} component={Overview} />
                    </Grid>
                </Grid>
                <Footer />
            </div>
        </>
    );
};

export default Dashboard;
