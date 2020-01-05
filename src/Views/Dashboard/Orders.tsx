import React, {useContext, useEffect, useState} from 'react';
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
import {DashboardContext} from '../../Context';
import moment from 'moment';
import {displayPrice} from '../../_helpers';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {Helmet} from 'react-helmet';

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
        padding: '1rem 2rem',
        marginBottom: '1rem',
        borderRadius: '1.5%',
    },
    image: {
        height: '104px',
    },
    table: {
        maxWidth: '300px',
        overflow: 'scroll',
        '& tr': {
            fontSize: '14px !important',
            cursor: 'pointer',
        },
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
    [theme.breakpoints.down('sm')]: {
        tableContainer: {
            width: '70vw',
            overflow: 'scroll',
        },
    },
}));
const Orders = ({location, history}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders} = useContext(DashboardContext);

    const navigateBackArrow = () => {
        history.goBack();
    };

    return (
        <Paper className={classes.paper}>
            <Helmet>
                <title>Orders</title>
            </Helmet>
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
                color={'primary'}
            >
                {location.pathname !== '/dashboard/orders' && (
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
                {location.pathname === '/dashboard/orders'
                    ? `Orders (${orders.length})`
                    : location.pathname.includes('item')
                    ? 'Order Item Details'
                    : 'Order Details'}
            </Typography>
            <Grid container spacing={3} className={classes.container}>
                <Route
                    path={'/dashboard/orders'}
                    exact
                    render={props => <ViewOrders {...props} />}
                />
                <Route
                    exact
                    path={'/dashboard/orders/detail/:orderId'}
                    render={props => <OrderDetails {...props} />}
                />
            </Grid>
        </Paper>
    );
};

const ViewOrders = ({}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders, firstName, lastName} = useContext(DashboardContext);

    return (
        <>
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
                                {firstName} {lastName}
                            </Typography>
                            <br />
                            <Typography variant={'caption'}>
                                {moment(or.createdAt).format('lll')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                            <Link to={`/dashboard/orders/detail/${or.id}`}>
                                <Button color={'primary'}>See details</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

const OrderDetails = ({match, history}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders} = useContext(DashboardContext);
    const [order, setOrder] = useState(({products: [], total: 0} as unknown) as Order);

    useEffect(() => {
        const {orderId} = match.params as any;
        if (orderId) {
            const currentOrder = orders.find(or => or.id == orderId);
            if (currentOrder) {
                setOrder(currentOrder);
            }
        }
    }, []);

    return (
        <>
            <Grid item xs={12} container>
                <Divider style={{color: 'red', marginTop: '-2rem', marginBottom: '1rem'}} />
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant={'h5'} style={{fontWeight: 600}}>
                            Order ID {order.id}
                        </Typography>
                        <br />
                        <Typography variant={'h5'} component={'h5'}>
                            Total: ₦{displayPrice(order.total)}
                        </Typography>
                        <br />
                        <Typography variant={'body2'} style={{fontSize: '18px'}}>
                            Item(s) {order.products && order.products.length}
                            <br />
                            {moment(order.createdAt).format('lll')}
                            <br />
                            <br />
                        </Typography>
                        <Typography variant={'h6'}>Items Order</Typography>
                    </Grid>
                    {order.products.map((pro, i) => (
                        <Grid item key={i} xs={12} className={classes.orders}>
                            <Grid container justify={'center'} alignItems={'center'}>
                                <Grid item xs={4} sm={3}>
                                    <img
                                        className={classes.image}
                                        alt={`${pro.name}`}
                                        src={pro.image}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                    <Typography variant={'body2'}>{pro.name}</Typography>
                                    <Typography variant={'overline'}>
                                        Qty: {pro.quantity}
                                        <br />
                                        Site: <span style={{fontWeight: 600}}>{pro.site}</span>
                                        <br />
                                        Tracking Number:{' '}
                                        <a href={pro.trackingLink}>{pro.trackingNumber}</a>
                                        <br />
                                        Tracking Link:{' '}
                                        <a target={'_blank'} href={pro.trackingLink}>
                                            <span style={{textTransform: 'lowercase'}}>
                                                {pro.trackingLink !== null
                                                    ? pro.trackingLink.slice(0, 30) + '...'
                                                    : ''}
                                            </span>
                                        </a>
                                        <br />
                                        STATUS:{pro.status || ''}
                                    </Typography>
                                    <Typography variant={'body2'}>
                                        Amount: ₦{pro.naira.toLocaleString()}
                                    </Typography>
                                    <Typography variant={'caption'}>
                                        {moment(order.createdAt).format('lll')}
                                    </Typography>
                                    <br />
                                    {!pro.trackingLink && (
                                        <Typography variant={'caption'}>
                                            Might take at least 3 working days before tracking
                                            number and link appears
                                        </Typography>
                                    )}
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
                        <Grid container className={classes.tableContainer}>
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
                                                        `/dashboard/payments/detail/${payment.id}`,
                                                    )
                                                }
                                            >
                                                <TableCell scope="row">
                                                    {payment.reference}
                                                </TableCell>
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
            </Grid>
        </>
    );
};

export default Orders;
