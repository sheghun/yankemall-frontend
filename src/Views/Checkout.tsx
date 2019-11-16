import React, {useCallback, useEffect, useMemo, useState} from 'react';
import logoImage from '../assets/images/eromalls-logo.png';
import queryString from 'query-string';
import Axios, {AxiosError} from 'axios';
import {Route, RouteComponentProps} from 'react-router';
import Loading from '../components/loading';
import Typography from '@material-ui/core/Typography';
import Snack from '../components/snack';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Stepper from '../components/Stepper';
import {SignUpForm} from './Auth/Signup';
import {AddAddress} from './Dashboard/Address';
import CheckIcon from '@material-ui/icons/Check';
import classNames from 'classnames';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

const steps = ['Sign in', 'Address', 'Place Order'];

const useStyles = makeStyles(theme => ({
    wrapper: {
        height: '100vh',
        paddingTop: '24px',
        width: '100vw',
        boxSizing: 'border-box',
        backgroundColor: '#fafafa',
    },
    orderDetailsContainer: {
        padding: theme.spacing(1),
        backgroundColor: '#f9f9f9',
        maxHeight: '300px',
        overflow: 'scroll',
        // For target the papers in the grids
        '& .MuiPaper-elevation1': {
            padding: theme.spacing(1),
            fontWeight: 500 + '!important',
        },
    },
    orderDetailsHeader: {
        background: `linear-gradient(to right, ${theme.palette.primary.light} 85%, white)`,
        color: 'white',
        padding: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
        minHeight: '600px',
    },
    addressWrapper: {
        cursor: 'pointer',
        transition: 'all .5s ease-in-out',
        marginTop: '1rem',
        '&:hover ': {
            border: `solid 1px #ededed`,
            borderRadius: '2%',
        },
    },
    selectedAddress: {
        border: `solid 1px #EDEDED`,
    },
    image: {
        height: '64px !important',
    },
    increments: {
        display: 'flex',
        alignItems: 'center',
    },
    container: {},
}));

type props = RouteComponentProps & {};
type Cart = {
    products: Array<Product>;
    shippingFee: number;
    totalNaira: number;
    totalDollar: number;
};

const Checkout = ({location}: props) => {
    const classes = useStyles();

    const [activeStep, setActiveStep] = useState(0);
    const [userDetails, setUserDetails] = useState({} as User);
    const [cart, setCart] = useState({
        products: [],
        shippingFee: 0,
        total: 0,
        totalNaira: 0,
        totalDollar: 0,
    } as Cart);
    const [siteId, setSiteId] = useState(0);
    const [addressId, setAddressId] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const {yankeemallData} = queryString.parse(location.search);

    const loadUserDetails = async () => {
        setLoading(true);
        try {
            const {status, data} = await Axios.get('/user');
            if (status === 200 && data.status === 'success') {
                setActiveStep(1);
                setUserDetails(data.data.data);
            }
        } catch (err) {}
        setLoading(false);
    };

    useEffect(() => {
        loadUserDetails();
    }, []);

    useEffect(() => {
        Axios.interceptors.response.use(
            res => Promise.resolve(res),
            err => {
                if (err.response) {
                    if (err.response.status === 403) {
                        setActiveStep(0);
                    }
                }
                return Promise.reject(err);
            },
        );
    }, []);

    useEffect(() => {
        // Get the cart from the session
        (async () => {
            setLoading(true);
            await (async () => {
                try {
                    const {yankeemallData} = queryString.parse(location.search);
                    if (yankeemallData) {
                        const {status, data} = await Axios.post('/base/decrypt', {yankeemallData});
                        if (status === 200 && data.status === 'success') {
                            setCart(data.data.cart);
                            setSiteId(data.data.siteId);
                        }
                    }
                } catch (err) {}
            })();
            await (async () => {
                try {
                    const {status, data} = await Axios.get('/base/exchangeRate');
                    if (status === 200 && data.status === 'success') {
                        setExchangeRate(Number(data.data.exchangeRate));
                    }
                } catch (e) {}
            })();
            setLoading(false);
        })();
    }, [location.search]);

    const selectAddress = (id: number) => () => {
        setAddressId(id);
    };

    const placeOrder = async () => {
        try {
            const d = {
                yankeemallData,
                cart,
                addressId,
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
                const {status} = response;
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

    /**
     * To reduce the quantity of a product
     */
    const reduceQuantity = (productIndex: number) => () => {
        const productsArray = cart.products.slice();
        const currentProduct = productsArray[productIndex];
        currentProduct.quantity =
            Number(currentProduct.quantity) <= 1
                ? 1
                : ((Number(currentProduct.quantity) - 1) as any);
        productsArray[productIndex] = currentProduct;
        let totalDollar = 0;
        let totalNaira = 0;
        productsArray.forEach(product => {
            totalDollar += Number(product.quantity) * product.dollar;
        });
        totalDollar = Number(totalDollar.toFixed(2));
        totalNaira = Number((totalDollar * exchangeRate).toFixed(2));
        setCart(c => ({...c, products: productsArray, totalNaira, totalDollar}));
        setCart(c => ({...c, products: productsArray}));
    };
    /**
     * To reduce the quantity of a product
     */
    const increaseQuantity = (productIndex: number) => () => {
        const productsArray = cart.products.slice();
        const currentProduct = productsArray[productIndex];
        currentProduct.quantity =
            Number(currentProduct.quantity) >= 10
                ? 10
                : ((Number(currentProduct.quantity) + 1) as any);
        productsArray[productIndex] = currentProduct;
        let totalDollar = 0;
        let totalNaira = 0;
        productsArray.forEach(product => {
            totalDollar += Number(product.quantity) * product.dollar;
        });
        totalDollar = Number(totalDollar.toFixed(2));
        totalNaira = Number((totalDollar * exchangeRate).toFixed(2));
        setCart(c => ({...c, products: productsArray, totalNaira, totalDollar}));
    };

    const displayPrice = (price: number | string, quantity: number | string) => {
        price = (+price * +quantity).toFixed(2);
        const priceArrayString = price.split('.');

        return `$${Number(priceArrayString[0]).toLocaleString()}.${priceArrayString[1]}`;
    };

    const displayTotal = useCallback(
        (showNaira: boolean | any) => {
            const {totalNaira, totalDollar} = cart;
            const nairaArrayString = String(totalNaira).split('.');
            const dollarArrayString = String(totalDollar).split('.');

            return (
                <>
                    ${Number(dollarArrayString[0]).toLocaleString()}.{dollarArrayString[1]}
                    {showNaira && (
                        <>
                            <br />
                            <Typography variant={'subtitle1'}>
                                ₦{Number(nairaArrayString[0]).toLocaleString()}.
                                {nairaArrayString[1]}{' '}
                            </Typography>
                        </>
                    )}
                </>
            );
        },
        [cart.totalNaira, cart.totalDollar],
    );

    const renderCurrentStep = useMemo(() => {
        switch (activeStep) {
            case 0:
                return (
                    <SignInOrUp
                        next={async () => {
                            await loadUserDetails();
                            setActiveStep(activeStep + 1);
                        }}
                    />
                );

            case 1:
                return (
                    <Address
                        next={async () => {
                            await loadUserDetails();
                            setActiveStep(activeStep + 1);
                        }}
                        currentAddressId={addressId}
                        selectAddress={selectAddress}
                        addresses={userDetails.address === null ? [] : userDetails.address}
                    />
                );

            case 2:
                return <Review displayTotal={displayTotal} placeOrder={placeOrder} />;
        }
    }, [activeStep, userDetails.address, addressId, cart.totalNaira]);

    return (
        <div className={classes.wrapper}>
            {/*<Nav />*/}
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Loading show={loading} />
            <Grid container className={classes.container} alignItems={'stretch'} justify={'center'}>
                <Grid item xs={12} sm={6} md={6}>
                    <Paper className={classes.paper} elevation={4}>
                        <Grid container justify={'center'}>
                            <Grid item xs={12}>
                                <img src={logoImage} height={'64px'} alt={'Eromalls Company'} />
                            </Grid>
                            <Grid item xs={12}>
                                <Stepper activeStep={activeStep} steps={steps} />
                            </Grid>
                            <Grid item xs={12} sm={7}>
                                {loading ? <CircularProgress /> : renderCurrentStep}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Paper elevation={4}>
                        <Grid container>
                            <Grid item xs={12} className={classes.orderDetailsHeader}>
                                <Typography variant={'overline'} style={{color: 'white'}}>
                                    Order Details
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {/*<Grid container className={classes.orderDetailsContainer}>*/}
                                {/*    <Grid item xs={12}>*/}
                                {/*        <Paper*/}
                                {/*            style={{*/}
                                {/*                padding: '24px 16px',*/}
                                {/*            }}*/}
                                {/*        >*/}
                                {/*            <Grid container justify={'space-between'}>*/}
                                {/*                <Grid*/}
                                {/*                    item*/}
                                {/*                    xs={12}*/}
                                {/*                    sm={3}*/}
                                {/*                    style={{*/}
                                {/*                        textAlign: 'left',*/}
                                {/*                    }}*/}
                                {/*                >*/}
                                {/*                    Grand Total*/}
                                {/*                </Grid>*/}
                                {/*                <Grid*/}
                                {/*                    item*/}
                                {/*                    xs={12}*/}
                                {/*                    sm={3}*/}
                                {/*                    style={{*/}
                                {/*                        textAlign: 'right',*/}
                                {/*                    }}*/}
                                {/*                >*/}
                                {/*                    {displayTotal(true)}*/}
                                {/*                </Grid>*/}
                                {/*            </Grid>*/}
                                {/*        </Paper>*/}
                                {/*    </Grid>*/}
                                {/*</Grid>*/}
                                <Grid container className={classes.orderDetailsContainer}>
                                    <Paper
                                        style={{
                                            backgroundColor: 'white',
                                            overflow: 'scroll',
                                        }}
                                    >
                                        <Grid container>
                                            {cart.products.length === 0 ? (
                                                <Grid item xs={12}>
                                                    <div style={{width: '100%'}}>
                                                        <CircularProgress />
                                                    </div>
                                                </Grid>
                                            ) : (
                                                cart.products.map((product, i) => (
                                                    <Grid key={i} item xs={12}>
                                                        <Grid
                                                            container
                                                            justify={'space-between'}
                                                            style={{
                                                                padding: '24px 16px',
                                                            }}
                                                        >
                                                            <Grid
                                                                item
                                                                container
                                                                xs={12}
                                                                alignItems={'center'}
                                                            >
                                                                <Grid item xs={12} sm={3}>
                                                                    <img
                                                                        alt={product.title}
                                                                        src={product.image}
                                                                        className={classes.image}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={12} sm={6}>
                                                                    <Grid container>
                                                                        <Grid item xs={12}>
                                                                            <Typography
                                                                                variant={'body2'}
                                                                            >
                                                                                {product.title}
                                                                                <br />
                                                                                {JSON.parse(
                                                                                    product.properties,
                                                                                ).map(
                                                                                    (
                                                                                        p: string,
                                                                                        index: number,
                                                                                    ) => (
                                                                                        <>
                                                                                            <Typography
                                                                                                key={
                                                                                                    index
                                                                                                }
                                                                                                variant={
                                                                                                    'caption'
                                                                                                }
                                                                                            >
                                                                                                {p.trim()}
                                                                                            </Typography>
                                                                                            ;{' '}
                                                                                        </>
                                                                                    ),
                                                                                )}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <IconButton
                                                                                color={'primary'}
                                                                                onClick={reduceQuantity(
                                                                                    i,
                                                                                )}
                                                                            >
                                                                                <RemoveCircleIcon />
                                                                            </IconButton>
                                                                            {product.quantity}
                                                                            <IconButton
                                                                                color={'primary'}
                                                                                onClick={increaseQuantity(
                                                                                    i,
                                                                                )}
                                                                            >
                                                                                <AddCircleIcon />
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                    sm={3}
                                                                    style={{
                                                                        textAlign: 'right',
                                                                    }}
                                                                >
                                                                    {displayPrice(
                                                                        product.price,
                                                                        product.quantity,
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Divider />
                                                    </Grid>
                                                ))
                                            )}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.orderDetailsContainer}>
                                <Paper
                                    style={{
                                        padding: '32px 24px',
                                    }}
                                >
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography variant={'body2'}>
                                                        Subtotal
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {displayTotal(false)}
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography variant={'body2'}>
                                                        Shipping
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    $0
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                style={{
                                                    marginTop: '1rem',
                                                }}
                                            >
                                                <Grid item xs={6}>
                                                    Total
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    style={{
                                                        textAlign: 'right',
                                                    }}
                                                >
                                                    {displayTotal(true)}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Checkout;

const SignInOrUp = ({next}: {next: any}) => {
    const [view, setView] = useState(0); // 0 for signIn 1 for signUp
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [errors, setErrors] = useState({email: '', password: ''});
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    useEffect(() => {});

    const validate = () => {
        let pass = true;

        const errors = {
            email: '',
            password: '',
        };
        if (email.length <= 1 || !emailTestString.test(email)) {
            pass = false;
            errors.email = 'Email is required and must be a valid email';
        }
        if (password.length < 6) {
            pass = false;
            errors.password = 'Password is required and must be at least six characters';
        }
        setErrors(errors);
        return pass;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        const d = {
            email,
            password,
        };
        try {
            const {status, data} = await Axios.post('/user/login', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({open: true, variant: 'success', message: 'Sign in Successful'});
                next();
            }
        } catch (e) {
            const err = e as AxiosError;
            setSnackbar({
                open: true,
                variant: 'error',
                message: 'Email or Password incorrect',
            });
        }
        setLoading(false);
    };

    return view === 0 ? (
        <form
            onSubmit={submit}
            style={{
                width: '100%',
                display: 'flex',
                height: '400px',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
            }}
        >
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <TextField
                margin="normal"
                required
                style={{width: '80%'}}
                error={!!errors.email}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => setEmail(e.target.value)}
            />
            <TextField
                margin="normal"
                error={!!errors.password}
                required
                style={{width: '80%'}}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                style={{width: '80%'}}
                variant="contained"
                color="primary"
                disabled={loading}
            >
                {loading ? <CircularProgress /> : 'Sign in'}
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link to="/auth/forgotpass">
                        <Typography variant="body2" color={'primary'}>
                            Forgot password?
                        </Typography>
                    </Link>
                </Grid>
                <Grid item>
                    <Link to={'#'}>
                        <Typography color={'primary'} variant="body2" onClick={() => setView(1)}>
                            {"Don't have an account? Sign Up"}
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
        </form>
    ) : (
        <Route render={props => <SignUpForm {...props} navigate={() => next()} />} />
    );
};

const Address = ({
    next,
    addresses,
    selectAddress,
    currentAddressId,
}: {
    next: any;
    addresses: Array<Address>;
    selectAddress: any;
    currentAddressId: number;
}) => {
    const classes = useStyles();
    return Array.isArray(addresses) && addresses.length === 0 ? (
        <Route render={props => <AddAddress {...props} navigate={next} />} />
    ) : (
        <Grid container spacing={5}>
            <Typography variant={'overline'}>Select An Existing Address</Typography>
            {addresses.map(address => (
                <Grid
                    key={address.id}
                    item
                    xs={12}
                    className={classNames({
                        [classes.addressWrapper]: true,
                        [classes.selectedAddress]: address.id == currentAddressId,
                    })}
                    onClick={selectAddress(address.id)}
                >
                    <Grid container>
                        <Grid item xs={2}>
                            {address.id == currentAddressId && <CheckIcon />}
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant={'body1'}>
                                {address.address}
                                <br />
                                {address.firstName} {address.lastName}
                                <br />
                                {address.phoneNumber}
                                <br />
                                {address.zipCode}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12}>
                <Button
                    disabled={!currentAddressId}
                    fullWidth
                    variant={'contained'}
                    onClick={() => next()}
                    color={'primary'}
                >
                    Continue
                </Button>
            </Grid>
        </Grid>
    );
};

const Review = ({placeOrder, displayTotal}: {placeOrder: any; displayTotal: any}) => {
    const [loading, setLoading] = useState(false);

    const onPlaceOrder = async () => {
        setLoading(true);
        await placeOrder();
        setLoading(false);
    };

    return (
        <>
            <Typography variant={'h6'}>Review Your Products At The Right Once More</Typography>
            <br />
            <Typography variant={'h5'}>Total: {displayTotal(true)}</Typography>
            <br />
            <Button disabled={loading} fullWidth color={'primary'} onClick={onPlaceOrder}>
                {loading ? <CircularProgress /> : 'Place Order '}
            </Button>
        </>
    );
};
