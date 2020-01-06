import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import {RouteComponentProps} from 'react-router';

const Logout = ({history}: RouteComponentProps) => {
    useEffect(() => {
        setTimeout(() => {
            axios.get('/user/logout');
        }, 5000);
        history.push(`/`);
    }, []);

    return (
        <Grid container justify={'center'} alignItems={'center'} style={{height: '100vh'}}>
            <CircularProgress />
        </Grid>
    );
};

export default Logout;
