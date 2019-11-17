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
import {AdminContext, DashboardContext} from '../../Context';
import moment from 'moment';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import {displayPrice} from '../../_helpers';
import Admin from '../../Layouts/Admin';

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
    table: {
        minWidth: 650,
        '& td': {
            fontSize: '14px !important',
        },
        '& tr': {
            cursor: 'pointer',
        },
    },
    container: {
        justifyContent: 'center',
        maxWidth: '90vw',
        overflow: 'hidden',
    },
}));

const Payments = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Route
                path={'/superAdmin/tl/payments'}
                exact
                render={props => <ShowPayments {...props} />}
            />
            <Route
                path={'/superAdmin/tl/payments/detail/:paymentId'}
                render={props => <PaymentDetails {...props} />}
            />
        </Paper>
    );
};

const ShowPayments = ({history}: RouteComponentProps) => {
    const classes = useStyles();

    const {orders} = useContext(AdminContext);

    return (
        <>
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
                color={'primary'}
            >
                Payments
            </Typography>
            <Grid container className={classes.container}>
                <Grid item xs={12}>
                    <Grid container>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reference</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="left">Date</TableCell>
                                    <TableCell align="left">Amount</TableCell>
                                    <TableCell align="left">User</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map(order =>
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
                                    )),
                                )}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

const PaymentDetails = ({history, match}: RouteComponentProps) => {
    const classes = useStyles();

    const {payments, orders} = useContext(AdminContext);

    const [currentPaymentDetails, setCurrentPaymentDetails] = useState({} as Payment);
    const [currentOrderDetails, setCurrentOrderDetails] = useState({} as Order);

    useEffect(() => {
        const {paymentId} = match.params as any;
        const getPaymentDetails = payments.find(payment => payment.id == paymentId);

        if (getPaymentDetails) {
            const getOrderDetails = orders.find(order =>
                order.payments.find(payment => payment.id == paymentId),
            );
            if (getOrderDetails) {
                setCurrentOrderDetails(getOrderDetails);
            }
            setCurrentPaymentDetails(getPaymentDetails);
        }
    }, [match.params]);

    return (
        <>
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
                color={'primary'}
            >
                <IconButton
                    color={'primary'}
                    onClick={() => history.goBack()}
                    aria-label={'Edit your details'}
                >
                    <ArrowBackIcon
                        style={{marginRight: '1rem', marginLeft: '-2rem'}}
                        fontSize={'large'}
                    />
                </IconButton>
                Payments Details
            </Typography>
            <Grid container className={classes.container}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant={'h5'}>
                                Amount: ₦{displayPrice(currentPaymentDetails.amount)}
                            </Typography>
                            <Typography variant={'body2'} style={{fontSize: '18px'}}>
                                <br />
                                Dollar:{' '}
                                <strong>${displayPrice(currentPaymentDetails.dollar)}</strong>
                                <br />
                                <br />
                                Reference: <strong>{currentPaymentDetails.reference}</strong>
                                <br />
                                <br />
                                Description: <strong>{currentPaymentDetails.description}</strong>
                                <br />
                                <br />
                                <strong>Status:</strong>{' '}
                                <span style={{color: currentPaymentDetails.paid ? 'green' : 'red'}}>
                                    {currentPaymentDetails.paid ? 'Successful' : 'Not successful'}
                                </span>
                                <br />
                                <Typography variant={'caption'}>
                                    *If your account has been debited and doesn&apos;t reflect here
                                    write an email to us with the payment reference in it we will
                                    fix that for you asap*
                                </Typography>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant={'h5'} style={{margin: '4rem 0'}}>
                                Order
                            </Typography>
                            <Grid item xs={12} className={classes.orders}>
                                <Grid container justify={'center'} style={{marginTop: '1rem'}}>
                                    {currentOrderDetails.products && (
                                        <>
                                            <Grid item xs={4} sm={3}>
                                                {currentOrderDetails.products.map((p, i) => (
                                                    <img
                                                        key={i}
                                                        height={'80px'}
                                                        alt={`${p.name}`}
                                                        src={p.image}
                                                    />
                                                ))}
                                            </Grid>
                                            <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                                <Typography variant={'body2'}>
                                                    {currentOrderDetails.products.map((p, i) => {
                                                        if (i === 4) {
                                                            return;
                                                        }
                                                        return `${p.name.slice(0, 20)}... `;
                                                    })}
                                                </Typography>
                                                <Typography variant={'body2'}>
                                                    Items: {currentOrderDetails.products.length}
                                                </Typography>
                                                <Typography variant={'body2'}>
                                                    Price: ₦
                                                    <span style={{fontWeight: 600}}>
                                                        {currentOrderDetails.total}
                                                    </span>
                                                </Typography>
                                                <br />
                                                <Typography variant={'caption'}>
                                                    {moment(currentOrderDetails.createdAt).format(
                                                        'lll',
                                                    )}
                                                </Typography>
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                                        <Link
                                            to={`/superAdmin/tl/orders/detail/${currentOrderDetails.id}`}
                                        >
                                            <Button color={'primary'}>See details</Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Payments;
