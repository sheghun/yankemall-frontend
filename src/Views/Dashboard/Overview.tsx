import React, {useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import {DashboardContext} from '../../Context';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    pageTitle: {
        marginBottom: '3rem',
    },
    card: {
        width: '100%',
        border: 'solid 1px #EDEDED',
    },
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    icon: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        marginTop: '-1rem',
        position: 'absolute',
        right: '0',
    },
    title: {
        fontSize: 14,
        position: 'relative',
        borderBottom: 'solid 1px #ededed',
        textTransform: 'uppercase',
    },
    pos: {
        marginBottom: 12,
    },
}));

const Overview = () => {
    const classes = useStyles();

    const {firstName, lastName, address, email} = useContext(DashboardContext);
    console.log(address);

    const renderAddress = () => {
        const defaultAddress = address.find(ad => ad.default);

        return (
            <Card raised={false} elevation={0} className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} gutterBottom>
                        Address Book
                        {defaultAddress && (
                            <Link
                                to={`/dashboard/address/edit?id=${defaultAddress.id}`}
                                className={classes.icon}
                            >
                                <IconButton color={'primary'} aria-label={'Edit your address book'}>
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        )}
                    </Typography>
                    <Typography variant="body2" style={{fontWeight: 500}}>
                        Default Shipping address
                    </Typography>
                    <Typography className={classes.pos} style={{fontSize: '12px'}}>
                        {address.length === 0 ? (
                            'You have not added an address yet'
                        ) : defaultAddress ? (
                            <>
                                {defaultAddress.firstName} {defaultAddress.lastName}
                                <br />
                                {defaultAddress.address}
                                <br />
                                {defaultAddress.phoneNumber}
                            </>
                        ) : (
                            <>You have not set your default address</>
                        )}
                    </Typography>
                </CardContent>
                <CardActions>
                    {address.length === 0 && (
                        <Link to={'/dashboard/address/add'}>
                            <Button size="small" color={'primary'}>
                                Add Address
                            </Button>
                        </Link>
                    )}
                </CardActions>
            </Card>
        );
    };

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Account Overview
            </Typography>
            <Grid container={true} justify={'space-evenly'} spacing={3}>
                <Grid item={true} xs={12} sm={5}>
                    <Card raised={false} elevation={0} className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Account Details
                                <Link to={'/dashboard/details'} className={classes.icon}>
                                    <IconButton color={'primary'} aria-label={'Edit your details'}>
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            </Typography>
                            <Typography variant="body2" style={{fontWeight: 500}}>
                                {firstName} {lastName}
                            </Typography>
                            <Typography className={classes.pos}>{email}</Typography>
                        </CardContent>
                        <CardActions>
                            <Link to={'/dashboard/changepass'}>
                                <Button size="small" color={'primary'}>
                                    Change Password
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    {renderAddress()}
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card raised={false} elevation={0} className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Orders
                            </Typography>
                            <Typography variant="h6" component="h2">
                                20
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color={'primary'}>
                                View Orders
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Overview;
