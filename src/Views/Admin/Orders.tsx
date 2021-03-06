import React, {useContext, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {Link, Route, RouteComponentProps} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import {AdminContext} from '../../Context';
import moment from 'moment';
import Axios from 'axios';
import Snack from '../../components/snack';
import {displayPrice} from '../../_helpers';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

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

    const [loading, setLoading] = useState(false);

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

const ViewOrders = ({}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders, users, setAdminObject} = useContext(AdminContext);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });

    /**
     * The order's user firstname and lastname
     * @param id - of the order
     */
    const getUserFirstAndLastName = (id: string | number) => {
        // get the user
        const user = users.find(user => user.id == id);

        if (user) {
            return `${user.firstName} ${user.lastName}`;
        }
        return '';
    };

    /**
     * Responsible for deleting an order
     */
    const deleteOrder = (id: number) => async () => {
        const newOrderArray = orders.slice();
        const newUsersArray = users.slice();
        const filteredOrders = newOrderArray.filter(order => order.id != id);
        const user = users.find(user => user.orders.find(order => order.id == id));
        if (user) {
            const userIndex = users.findIndex(u => u.id == user.id);
            //  Filter user order
            user.orders = user.orders.filter(order => order.id == id);
            // Replace the old user with the new user object
            newUsersArray[userIndex] = user;
            setAdminObject(obj => ({...obj, users: newUsersArray, orders: filteredOrders}));

            // Send the delete request to the server
            const {status, data} = await Axios.delete(`/admin/order/${id}`);
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    message: 'Order deleted successfully',
                    variant: 'success',
                });
            }
        }
    };

    return (
        <>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            {orders.map((or, i) => (
                <Grid key={i} item xs={12} className={classes.orders}>
                    <Grid container justify={'center'}>
                        <Grid item xs={4} sm={3}>
                            {or.products.map((p, i) => (
                                <img key={i} height={'80px'} alt={`${p.name}`} src={p.image} />
                            ))}
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                            <Typography variant={'body2'}>
                                {or.products.map((p, i) => {
                                    if (i === 4) {
                                        return;
                                    }
                                    return `${p.name.slice(0, 20)}... `;
                                })}
                            </Typography>
                            <Typography variant={'body2'}>Items: {or.products.length}</Typography>
                            <Typography variant={'body2'}>
                                Price: ₦<span style={{fontWeight: 600}}>{or.total}</span>
                            </Typography>
                            <Typography variant={'body2'}>
                                {getUserFirstAndLastName(or.id)}
                            </Typography>
                            <br />
                            <Typography variant={'caption'}>
                                {moment(or.createdAt).format('lll')}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={3}
                            style={{textAlign: 'center'}}
                            justify={'space-between'}
                            direction={'column'}
                            container
                        >
                            <Link to={`/superAdmin/tl/orders/detail/${or.id}`}>
                                <Button color={'primary'}>See details</Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '2rem'}} container justify={'center'}>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            onClick={deleteOrder(or.id)}
                        >
                            Delete order
                        </Button>
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

const OrderDetails = ({history, match}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders, users} = useContext(AdminContext);

    const [order, setOrder] = useState(({products: [], total: 0} as unknown) as Order);
    const [currentUser, setCurrentUser] = useState({} as User);

    useEffect(() => {
        const {orderId} = match.params as any;
        console.log(orderId);
        if (orderId) {
            const currentOrder = orders.find(or => or.id == orderId);
            if (currentOrder) {
                setOrder(oldObj => ({...oldObj, ...currentOrder}));
                const user = users.find(user => currentOrder.userId == user.id);
                if (user) {
                    setCurrentUser(user);
                }
            }
        }
    }, [orders, users]);

    return (
        <>
            <Grid item xs={12} container>
                <Divider style={{color: 'red', marginTop: '-2rem', marginBottom: '1rem'}} />
                <Grid item xs={12}>
                    <Typography variant={'h5'}>Order ID {order.id}</Typography>
                    <Typography variant={'body2'}>
                        Item(s) {order.products && order.products.length}
                        <br />
                        {moment(order.createdAt).format('lll')}
                    </Typography>
                    <Typography variant={'h5'} component={'h5'}>
                        Total: ₦ {displayPrice(order.total)}
                    </Typography>
                    <br />
                    <br />
                    <Typography variant={'overline'} style={{fontWeight: 600}}>
                        Item(s) {order.products && order.products.length}
                        <br />
                    </Typography>
                    <Typography variant={'body2'}>
                        Name:{' '}
                        <Link to={`/superAdmin/tl/users/detail/${currentUser.id}`}>
                            {currentUser.firstName} {currentUser.lastName}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <br />
                    <br />
                    <Typography variant={'h5'}>Order Items</Typography>
                    <br />
                    <br />
                </Grid>
                <br />
                <br />
                {order.products &&
                    order.products.map((pro, i) => (
                        <Grid key={i} item xs={12} className={classes.orders}>
                            <Grid container justify={'center'}>
                                <Grid item xs={4} sm={3}>
                                    <img className={classes.image} alt={pro.name} src={pro.image} />
                                </Grid>
                                <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                    <Typography variant={'body2'}>{pro.name}</Typography>
                                    <Typography variant={'body2'}>
                                        {(pro.properties as Array<string>).map(property => {
                                            return (
                                                <>
                                                    <br />
                                                    {property.trim()}
                                                </>
                                            );
                                        })}
                                    </Typography>
                                    <Typography variant={'overline'} style={{marginTop: '-1rem'}}>
                                        Site:{' '}
                                        <span style={{fontWeight: 600}}>{order.siteHost}</span>
                                        <br />
                                        Tracking Number: {pro.trackingNumber || 'Not set yet'}
                                        <br />
                                        Tracking Link:{' '}
                                        <a href={pro.trackingLink}>
                                            <span style={{textTransform: 'lowercase'}}>
                                                {pro.trackingLink !== null
                                                    ? pro.trackingLink.slice(0, 30) + '...'
                                                    : ''}
                                            </span>
                                        </a>
                                        <br />
                                        STATUS: {pro.status}
                                    </Typography>
                                    <Typography variant={'body2'}>
                                        Amount: ₦{pro.naira.toLocaleString()}
                                    </Typography>
                                    <Typography variant={'caption'}>
                                        {moment(order.createdAt).format('lll')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                                    <Link
                                        to={`/superAdmin/tl/orders/detail/${order.id}/item/${pro.id}`}
                                    >
                                        <Button color={'primary'}>Edit Item</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                <Grid item xs={12}>
                    <Typography variant={'h5'} style={{margin: '4rem 0 2rem'}}>
                        Payment Ticket
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reference</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">Date</TableCell>
                                    <TableCell align="left">Amount</TableCell>
                                    <TableCell align="left">Order ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.payments &&
                                    order.payments.map(payment => (
                                        <TableRow
                                            key={payment.id}
                                            hover
                                            onClick={() =>
                                                history.push(
                                                    `/superAdmin/tl/payments/detail/${payment.id}`,
                                                )
                                            }
                                        >
                                            <TableCell scope="row">{payment.reference}</TableCell>
                                            <TableCell align="left">
                                                {payment.paid ? 'Successful' : 'Not Successful'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {moment(payment.createdAt).format('lll')}
                                            </TableCell>
                                            <TableCell align="center">
                                                ₦{displayPrice(payment.amount)}
                                            </TableCell>
                                            <TableCell align="left">{order.id}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

const OrderItem = ({match}: RouteComponentProps) => {
    const classes = useStyles();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });

    const {orders, setAdminObject} = useContext(AdminContext);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState({} as OrderProduct);
    const [status, setStatus] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingLink, setTrackingLink] = useState('');

    useEffect(() => {
        const {orderId, itemId} = match.params as any;
        if (orderId) {
            const currentOrder = orders.find(order => order.id == orderId);
            if (currentOrder) {
                const ordPro = currentOrder.products.find(product => product.id == itemId);
                if (ordPro) {
                    setItem(ordPro);
                    setStatus(ordPro.status);
                    setTrackingNumber(ordPro.trackingNumber);
                    setTrackingLink(ordPro.trackingLink);
                }
            }
        }
    }, [orders]);

    /**
     * Update the tracking link, tracking number and status of a product
     */
    const update = async () => {
        // Validated if one of the inputs are missing
        if (!trackingLink || !trackingNumber || !status) return;

        // Try updated it at the server
        setLoading(true);
        const {orderId, itemId} = match.params as any;
        const res = await Axios.put(`/admin/order/product`, {
            trackingLink,
            trackingNumber,
            status,
            id: itemId,
        });
        if (!(res.status === 200 && res.data.status === 'success')) return; // Exit if not successful
        setSnackbar({
            open: true,
            message: 'Product updated successfully',
            variant: 'success',
        });
        // Get the order index
        const orderIndex = orders.findIndex(order => order.id == orderId);
        if (!(orderIndex > -1)) return; // If order is not found exit

        const currentOrder = orders[orderIndex];
        if (!currentOrder) return; // If current order is not found exit

        // The product index
        const productIndex = currentOrder.products.findIndex(product => product.id == itemId);
        if (!(productIndex > -1)) return; // If product index is not found exit

        const product = currentOrder.products[productIndex];
        if (!product) return; // If product is not found exit

        // Set the values for the product
        product.trackingNumber = trackingNumber;
        product.trackingLink = trackingLink;
        product.status = status as any;

        // Add them back to the array
        currentOrder.products[productIndex] = product;
        orders[orderIndex] = currentOrder;

        setAdminObject(ad => ({...ad, orders}));

        setLoading(false);
    };

    return (
        <>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Grid item xs={12}>
                <Grid container component={'form'} alignContent={'center'} direction={'column'}>
                    <Grid item xs={12}>
                        <img className={classes.image} alt={item.name} src={item.image} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant={'h6'}>{item.name}</Typography>
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            margin={'normal'}
                            onChange={e => setStatus(e.target.value)}
                            value={status}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">Status</InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value={'Payment successful await shipment'}>
                                Payment successful await shipment
                            </MenuItem>
                            <MenuItem value={'Shipped awaiting delivery'}>
                                Shipped awaiting delivery
                            </MenuItem>
                            <MenuItem value={'Canceled'}>Canceled</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type={'text'}
                            value={trackingNumber}
                            label={'Tracking Number'}
                            onChange={e => setTrackingNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type={'text'}
                            value={trackingLink}
                            label={'Tracking Link'}
                            onChange={e => setTrackingLink(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} style={{marginTop: '2rem'}}>
                        <Button
                            fullWidth
                            color={'primary'}
                            disabled={loading}
                            onClick={update}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress /> : 'Save'}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Orders;
