import React, {useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import {Route, RouteComponentProps} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        height: '100%',
        paddingBottom: '2rem',
    },
    pageTitle: {
        marginBottom: '3rem',
    },
    orders: {
        border: '1px solid #ededed',
        marginBottom: '1rem',
        borderRadius: '1.5%',
    },
    image: {
        height: '104px',
    },
    container: {
        justifyContent: 'center',
    },
    [theme.breakpoints.up('md')]: {
        orders: {
            padding: theme.spacing(1),
            height: '150',
        },
        container: {
            justifyContent: 'space-evenly',
        },
        image: {
            width: 'auto',
            height: '104px',
        },
    },
}));
const Orders = ({location, history}: RouteComponentProps) => {
    const classes = useStyles();

    const navigateBackArrow = () => {
        history.goBack();
    };

    return (
        <Paper className={classes.paper}>
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
                color={'primary'}
            >
                {location.pathname !== '/superAdmin/tl/orders' && (
                    <IconButton
                        color={'primary'}
                        onClick={navigateBackArrow}
                        aria-label={'Edit your details'}
                    >
                        <ArrowBackIcon
                            style={{marginRight: '1rem', marginLeft: '-2rem'}}
                            fontSize={'large'}
                        />
                    </IconButton>
                )}
                {location.pathname === '/superAdmin/tl/orders'
                    ? 'Orders'
                    : location.pathname.includes('item')
                    ? 'Order Item Details'
                    : 'Order Details'}
            </Typography>
            <Grid container spacing={3} className={classes.container}>
                <Route
                    path={'/superAdmin/tl/orders'}
                    exact
                    render={props => <ViewOrders {...props} />}
                />
                <Route
                    path={'/superAdmin/tl/orders/detail/:orderId/item/:itemId'}
                    render={props => <OrderItem {...props} />}
                />
                <Route
                    exact
                    path={'/superAdmin/tl/orders/detail/:orderId'}
                    render={props => <OrderDetails {...props} />}
                />
            </Grid>
        </Paper>
    );
};

const ViewOrders = ({history}: RouteComponentProps) => {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={12} className={classes.orders}>
                <Grid container justify={'center'}>
                    <Grid item xs={4} sm={3}>
                        <img
                            className={classes.image}
                            alt={'Order Product'}
                            src={
                                'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                        <Typography variant={'body2'}>Cleansing Detox Foot Pads</Typography>
                        <Typography variant={'caption'}>Placed on 25-08-2019</Typography>
                        <br />
                        <br />
                        <br />
                        <Typography variant={'caption'}>DELIVERED ON 02-09-2019</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                        <Link to={'/superAdmin/tl/orders/detail/123'}>
                            <Button color={'primary'}>See details</Button>
                        </Link>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className={classes.orders}>
                <Grid container justify={'center'}>
                    <Grid item xs={4} sm={3}>
                        <img
                            className={classes.image}
                            alt={'Order Product'}
                            src={
                                'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                        <Typography variant={'body2'}>
                            Cleansing Detox Foot Pads, iPhone 6s, Tecno Camon X, iPhone 7...
                        </Typography>
                        <br />
                        <Typography variant={'body2'}>Items: 10</Typography>
                        <br />
                        <Typography variant={'body2'}>User: Oladiran Segun</Typography>
                        <br />
                        <Typography variant={'caption'}>Placed ON 02-09-2019</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                        <Button color={'primary'}>See details</Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

const OrderDetails = ({history, match}: RouteComponentProps) => {
    const classes = useStyles();
    const [orderId, setOrderId] = useState(0);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const {orderId} = match.params as any;
        if (orderId) {
            setOrderId(Number(orderId));
        }
    }, []);

    return (
        <>
            <Grid item xs={12}>
                <Divider style={{color: 'red', marginTop: '-2rem', marginBottom: '1rem'}} />
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant={'body2'} style={{fontWeight: 600}}>
                            Order no {2323134}
                        </Typography>
                        <Typography variant={'subtitle2'}>
                            1 items
                            <br />
                            Placed on 25-08-2019
                            <br />
                            Total: ₦ 90,000
                        </Typography>
                        <Divider />
                        <Typography variant={'overline'} style={{fontWeight: 600}}>
                            Items In User Order
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.orders}>
                        <Grid container justify={'center'}>
                            <Grid item xs={4} sm={3}>
                                <img
                                    className={classes.image}
                                    alt={'Order Product'}
                                    src={
                                        'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                <Typography variant={'body2'}>Cleansing Detox Foot Pads</Typography>
                                <Typography variant={'overline'}>
                                    Qty: 1
                                    <br />
                                    Site: <span style={{fontWeight: 600}}>ebay</span>
                                    <br />
                                    Tracking Number: <a href={'#'}>none</a>
                                    <br />
                                    Tracking Link: <a href={'#'}>none</a>
                                    <br />
                                    STATUS: Awaiting shipment
                                </Typography>
                                <Typography variant={'body2'}>Amount: ₦ 1,150</Typography>
                                <Typography variant={'caption'}>PLACED ON 02-09-2019</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                                <Link to={`/superAdmin/tl/orders/detail/${orderId}/item/456`}>
                                    <Button color={'primary'}>Edit Item</Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

const OrderItem = ({match}: RouteComponentProps) => {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={12}>
                <Grid container component={'form'} alignContent={'center'} direction={'column'}>
                    <Grid item xs={12}>
                        <img
                            className={classes.image}
                            alt={'Order Product'}
                            src={
                                'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            margin={'normal'}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">Status</InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem key={'pending'}>Pending</MenuItem>
                            <MenuItem key={'shipped'}>Shipped</MenuItem>
                            <MenuItem key={'canceled'}>Canceled</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth type={'text'} label={'Tracking Number'} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth type={'text'} label={'Tracking Link'} />
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '2rem'}}>
                        <Button fullWidth color={'primary'} variant={'contained'}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Orders;
