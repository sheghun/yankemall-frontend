import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    pageTitle: {
        marginBottom: '3rem',
    },
}));
const Orders = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Orders
            </Typography>
        </Paper>
    );
};

export default Orders;
