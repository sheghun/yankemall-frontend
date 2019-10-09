import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
import BookSvg from '../../assets/icons/address.svg';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

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
const Address = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Address Book
            </Typography>
            <Grid container>
                <Grid container justify={'center'}>
                    <img alt={'book'} height={'100px'} src={BookSvg} />
                    <Grid item xs={12} />
                    <Grid item xs={8} md={6} justify={'center'}>
                        <Typography variant={'body2'} align={'center'} style={{fontWeight: 600}}>
                            You have not added any address yet!
                        </Typography>
                        <Typography variant={'body1'} align={'center'}>
                            Add your shipping addresses here for a fast purchase experience! You
                            will be able to add, modify or delete them at any time.
                        </Typography>
                        <Button
                            color={'primary'}
                            style={{marginTop: '2rem'}}
                            variant={'contained'}
                            fullWidth
                        >
                            Add New Address
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Address;
