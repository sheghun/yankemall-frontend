import React, {useEffect, useState} from 'react';
import Wrapper from '../components/wrapper';
import styled from 'styled-components';
import {Helmet} from 'react-helmet';
import TopBar from '../components/topbar';
import logoImage from '../assets/images/eromalls-logo.png';
import classNames from 'classnames';
import queryString from 'query-string';
import Axios, {AxiosError} from 'axios';
import {RouteComponentProps} from 'react-router';
import Loading from '../components/loading';
import Typography from '@material-ui/core/Typography';
import Snack from '../components/snack';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';

const Style = styled.div`
    width: 100vw;
    box-sizing: border-box;
    & .logo-wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    & .logo-wrapper img {
        height: 100px;
    }
    & .order-summary {
        padding: 16px;
        width: 100%;
    }
    & .remove-order-button {
        cursor: pointer;
        transition: all 0.5s ease-in-out;
    }
    & .remove-order-button:hover {
        background-color: #ccc;
    }
    & .order-summary-header {
        display: flex;
        align-items: center;
        width: 80%;
        box-sizing: border-box;
        padding: -16px 16px 16px 16px;
        justify-content: space-between;
    }
    & .order-summary-header-step {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: -16px 16px 16px 16px;
        justify-content: space-evenly;
    }
    & .order-summary-header .active {
        color: #ff4252;
        border-bottom: solid 1px #ff4252;
    }
    & .order-summary-header p {
        font-family: 'Unica One';
        font-size: 48px;
        border-bottom: solid 1px black;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    & .order-summary-header p span {
        font-size: 16px;
    }
    & .order-summary-table {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    & .order-summary-table table {
        border-collapse: collapse;
        width: 80%;
        text-align: left;
        box-sizing: border-box;
    }
    & .order-summary-table-head th {
        text-transform: uppercase;
        padding-bottom: 8px;
        border-bottom: solid 3px #ccc;
    }
    & .order-summary-table-row td {
        border-bottom: solid 3px #ccc;
    }
    & .order-summary-table-row img {
        height: 100px;
    }
    & .order-summary-table-row-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 3px #ccc;
    }
    & .checkout-button-wrapper {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
    }
`;

type props = RouteComponentProps & {};
type cart = {
    products: Array<Product>;
    shippingFee: number;
    totalNaira: number;
    totalDollar: number;
};

const Checkout = ({location, history}: props) => {
    const [view, setView] = useState('shoppingCart');
    const [cart, setCart] = useState({
        products: [],
        shippingFee: 0,
        total: 0,
        totalNaira: 0,
        totalDollar: 0,
    } as cart);
    const [siteId, setSiteId] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const {yankeemallData} = queryString.parse(location.search);

    /**
     * Listen for 403 status error code and redirect to the login page
     */
    useEffect(() => {
        Axios.interceptors.response.use(
            response => Promise.resolve(response),
            error => {
                const err = error as AxiosError;
                if (err.response) {
                    if (err.response.status === 403) {
                        const queryParams = `?returnUrl=${
                            location.pathname
                        }&${location.search.replace('?', '')}`;
                        history.push(
                            `/auth/signin${queryParams}${
                                !queryParams.includes('step') ? 'step=3' : ''
                            }`,
                        );
                    }
                }
                return Promise.reject(error);
            },
        );
    }, [history, location.pathname, location.search]);

    useEffect(() => {
        // Get the cart from the session
        (async () => {
            const {yankeemallData} = queryString.parse(location.search);
            if (yankeemallData) {
                const {status, data} = await Axios.post('/base/decrypt', {yankeemallData});
                if (status === 200 && data.status === 'success') {
                    setCart(data.data.cart);
                    setSiteId(data.data.siteId);
                }
            }
        })();
        (async () => {
            try {
                const {status, data} = await Axios.get('/base/exchangeRate');
                if (status === 200 && data.status === 'success') {
                    setExchangeRate(Number(data.data.exchangeRate));
                }
            } catch (e) {}
        })();
    }, [location.search]);

    useEffect(() => {
        const step = queryString.parse(location.search).step;
        if (step) {
            setView('reviewAndOrder');
        }
    }, [location.search]);

    const placeOrder = async () => {
        try {
            const d = {
                yankeemallData,
                siteId,
            };
            const {status, data} = await Axios.post('/user/place-order', d);
            if (status === 201 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Order placed redirecting to paystack',
                });
                // @ts-ignore
                window.location = data.data.authorizationUrl;
            }
        } catch (err) {
            const {response} = err as AxiosError;
            if (response) {
                const {status, data} = response;
                if (status === 400) {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message: "Payment can't be initiated due to bad network try again",
                    });
                }
            }
        }
        return;
    };

    return (
        <Wrapper>
            <TopBar />
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css?family=Unica+One&display=swap"
                    rel="stylesheet"
                />
            </Helmet>
            <Style>
                <Snack
                    variant={snackbar.variant as any}
                    open={snackbar.open}
                    message={snackbar.message}
                    onClose={() => setSnackbar(s => ({...s, open: false}))}
                />
                <Loading show={loading} />
                <div className={'order-summary'}>
                    <div className={'order-summary-header'}>
                        <div className={'logo-wrapper'}>
                            <img src={logoImage} alt={'Logo'} />
                        </div>
                        <div className={'order-summary-header-step'}>
                            <p className={'active'}>
                                1
                                <span>
                                    Shopping <br /> Cart
                                </span>
                            </p>
                            <p className={classNames({active: view !== 'shoppingCart'})}>
                                2
                                <span>
                                    Address &amp; <br />
                                    Payment
                                </span>
                            </p>
                            <p className={classNames({active: view === 'reviewAndOrder'})}>
                                3
                                <span>
                                    Review &amp; <br />
                                    Order
                                </span>
                            </p>
                        </div>
                    </div>
                    {(() => {
                        switch (view) {
                            case 'shoppingCart':
                                return (
                                    <ShoppingCart
                                        cart={cart}
                                        exchangeRate={exchangeRate}
                                        history={history}
                                        location={location}
                                        next={() => setView('reviewAndOrder')}
                                    />
                                );
                            case 'reviewAndOrder':
                                return (
                                    <ReviewAndOrder
                                        cart={cart}
                                        location={location}
                                        placeOrder={placeOrder}
                                    />
                                );
                        }
                    })()}
                </div>
            </Style>
        </Wrapper>
    );
};

export default Checkout;

const ShoppingCart = ({
    next,
    cart,
    history,
    location,
}: {
    next: any;
    cart: cart;
    exchangeRate: number;
    history: props['history'];
    location: props['location'];
}) => {
    const proceed = async () => {
        // Try fetching the user details to check if the user is logged
        try {
            const {status, data} = await Axios.get('/user');
            if (status === 200 && data.status === 'success') {
                next();
            }
        } catch (error) {
            const {response} = error as AxiosError;
            if (response) {
                if (response.status === 403) {
                    const queryParams = `?returnUrl=${location.pathname}&${location.search.replace(
                        '?',
                        '',
                    )}`;
                    history.push(`/auth/signin${queryParams}&step=3`);
                }
            }
        }
    };

    return (
        <>
            <div className={'order-summary-table'}>
                <table>
                    <thead>
                        <tr className={'order-summary-table-head'}>
                            <th>Items</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.products.map((p, i) => (
                            <tr key={i} className={'order-summary-table-row'}>
                                <td className={'order-summary-table-row-item'}>
                                    <button className={'remove-order-button'}> X </button>
                                    <img src={p.image} alt={p.title} />
                                    <p style={{flexBasis: '60%'}}>{p.title}</p>
                                </td>
                                <td style={{textAlign: 'center'}}>{p.quantity}</td>
                                <td>
                                    ${p.dollar} <br />
                                    <Typography variant={'caption'} color={'textPrimary'}>
                                        ₦{p.naira}
                                    </Typography>
                                </td>
                                <td>₦{p.naira * Number(p.quantity)}</td>
                            </tr>
                        ))}
                        <tr className={'order-summary-table-row'}>
                            <td style={{border: 'none'}} />
                            <td style={{border: 'none'}} />
                            <td style={{fontWeight: 600, border: 'none'}}>Subtotal</td>
                            <td style={{fontWeight: 600, border: 'none', color: '#ff4252'}}>
                                ${cart.totalDollar}
                                <br />₦{cart.totalNaira}
                            </td>
                        </tr>
                        <tr className={'order-summary-table-row'}>
                            <td style={{border: 'none'}} />
                            <td style={{border: 'none'}} />
                            <td style={{fontWeight: 600}}>Estimate Shipping</td>
                            <td style={{fontWeight: 600, color: '#ff4252'}}>${cart.shippingFee}</td>
                        </tr>
                        <tr className={'order-summary-table-row'}>
                            <td style={{border: 'none'}} />
                            <td style={{border: 'none'}} />
                            <td style={{fontWeight: 600, border: 'none'}}>
                                <h3>TOTAL</h3>
                            </td>
                            <td style={{fontWeight: 600, color: '#ff4252', border: 'none'}}>
                                ${cart.totalDollar}
                                <br />
                                <Typography variant={'caption'}>₦{cart.totalNaira}</Typography>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={'checkout-button-wrapper'}>
                <Button color={'primary'} onClick={proceed} variant={'contained'}>
                    Continue
                </Button>
            </div>
        </>
    );
};

const ReStyle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    & .wrapper {
        text-align: center;
        width: 80%;
    }
    & .card {
        width: '100%';
        border: 'solid 1px #EDEDED';
    }
    & .pos {
        margin-bottom: 12px;
    }
    & .title {
        fontsize: 14;
        position: relative;
        text-transform: uppercase;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }
    & .icon: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
    },
`;

const ReviewAndOrder = ({
    placeOrder,
    location,
    cart,
}: {
    placeOrder: any;
    location: props['location'];
    cart: cart;
}) => {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({} as User);
    const [defaultAddress, setDefaultAddress] = useState({} as Address);

    useEffect(() => {
        const ad = sessionStorage.getItem('address');
        setAddress(ad ? ad : '');
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const {status, data} = await Axios.get('/user');
                if (status === 200 && data.status === 'success') {
                    setUser(data.data.data);
                }
            } catch (e) {}
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (user.address) {
            const adDefault = user.address.find(ad => ad.default);
            if (adDefault) {
                setDefaultAddress(adDefault);
            }
        }
    }, [user, user.address]);

    /**
     * Generate the address and must sure there is makes sure theres is only id in it
     * @param id
     */
    const genAddressLink = (id: string | number): string => {
        let link = `/dashboard/address/edit?id=${id}&returnUrl=${location.pathname}`;

        let search = location.search.replace('?', ''); // Remove the query symbol ?
        search = search.replace(/id=\d/, ''); // Remove any previous id parameter;

        link += search;

        console.log(link);

        return link;
    };

    return (
        <Paper style={{maxWidth: '750px', margin: '0 auto 0'}}>
            <ReStyle>
                <div className={'wrapper'}>
                    <div>
                        <Typography variant={'h5'}>Shipping Address</Typography>
                        <p>{address}</p>
                        <Grid
                            container
                            spacing={3}
                            justify={'space-evenly'}
                            alignItems={'baseline'}
                        >
                            {user.address ? (
                                user.address.length === 0 ? (
                                    <></>
                                ) : // @ts-ignore
                                defaultAddress.firstName ? (
                                    <Grid item xs={12} sm={6} md={5}>
                                        <Card raised={false} elevation={0} className={'card'}>
                                            <CardContent>
                                                <Typography className={'pos'} variant={'body2'}>
                                                    <>
                                                        {defaultAddress.firstName}{' '}
                                                        {defaultAddress.lastName}
                                                        <br />
                                                        {defaultAddress.address}
                                                        <br />
                                                        {'+' + defaultAddress.phoneNumber}
                                                        <br />
                                                        {defaultAddress.zipCode}
                                                    </>
                                                </Typography>

                                                {defaultAddress.default && (
                                                    <Typography
                                                        variant="body2"
                                                        color={'primary'}
                                                        style={{fontWeight: 500}}
                                                    >
                                                        Default address
                                                    </Typography>
                                                )}
                                            </CardContent>
                                            <CardActions style={{borderTop: 'solid 1px #ededed'}}>
                                                <Typography className={'title'}>
                                                    <Link
                                                        to={`${genAddressLink(defaultAddress.id)}`}
                                                    >
                                                        <Button
                                                            color={'primary'}
                                                            fullWidth
                                                            style={{textAlign: 'center'}}
                                                        >
                                                            Edit Address
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        to={`${genAddressLink(defaultAddress.id)}`}
                                                        className={'icon'}
                                                    >
                                                        <IconButton
                                                            color={'primary'}
                                                            aria-label={'Edit your address'}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Link>
                                                </Typography>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ) : (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography>
                                                You have no default address set yet, set a default
                                                address
                                            </Typography>
                                        </Grid>
                                        {user.address &&
                                            user.address.map((ad, i) => (
                                                <Grid key={i} item xs={12} sm={6} md={5}>
                                                    <Card
                                                        raised={false}
                                                        elevation={0}
                                                        className={'card'}
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                className={'pos'}
                                                                variant={'body2'}
                                                            >
                                                                <>
                                                                    {ad.firstName} {ad.lastName}
                                                                    <br />
                                                                    {ad.address}
                                                                    <br />
                                                                    {ad.phoneNumber}
                                                                    <br />
                                                                    {ad.state}
                                                                    <br />
                                                                    {ad.zipCode}
                                                                </>
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions
                                                            style={{borderTop: 'solid 1px #ededed'}}
                                                        >
                                                            <Typography className={'title'}>
                                                                <Link
                                                                    to={`${genAddressLink(ad.id)}`}
                                                                >
                                                                    <Button
                                                                        color={'primary'}
                                                                        fullWidth
                                                                        style={{
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        Edit Address
                                                                    </Button>
                                                                </Link>
                                                                <Link
                                                                    to={`${genAddressLink(ad.id)}`}
                                                                    className={'icon'}
                                                                >
                                                                    <IconButton
                                                                        color={'primary'}
                                                                        aria-label={
                                                                            'Edit your address'
                                                                        }
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Link>
                                                                {console.log(genAddressLink(ad.id))}
                                                            </Typography>
                                                        </CardActions>
                                                    </Card>
                                                </Grid>
                                            ))}
                                    </>
                                )
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </div>
                    <div>
                        <Typography variant={'h5'}> Total</Typography>
                        <br />
                        <Typography variant={'h6'}>₦{cart.totalNaira}</Typography>
                        <Button
                            color={'primary'}
                            onClick={async () => {
                                setLoading(true);
                                await placeOrder();
                                setLoading(false);
                            }}
                            style={{margin: '2rem 0'}}
                            disabled={loading}
                            variant={'contained'}
                        >
                            {loading ? <CircularProgress /> : <>Place Order &amp; Pay now</>}
                        </Button>
                    </div>
                </div>
            </ReStyle>
        </Paper>
    );
};
