import React, {useEffect, useState} from 'react';
import Wrapper from '../components/wrapper';
import styled from 'styled-components';
import {Helmet} from 'react-helmet';
import TopBar from '../components/topbar';
import logoImage from '../assets/images/pp.png';
import Button from '../components/button';
import classNames from 'classnames';
import queryString from 'query-string';
import Axios, {AxiosError} from 'axios';
import {RouteComponentProps} from 'react-router';
import Loading from '../components/loading';
import Snackbar from '../components/snackbar';

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
    total: number;
};

const Checkout = ({location}: props) => {
    const [view, setView] = useState('shoppingCart');
    const [cart, setCart] = useState({products: [], shippingFee: 0, total: 0} as cart);
    const [siteId, setSiteId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({show: false, message: ''});

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
    }, []);

    const placeOrder = async () => {
        setLoading(true);

        try {
            const d = {
                cart,
                siteId,
            };
            const {status, data} = await Axios.post('/user/place-order', d);
            if (status === 201 && data.status === 'success') {
                setSnackbar({show: true, message: 'Order placed, redirecting to paystack'});
                // @ts-ignore
                window.location = data.data.authorizationUrl;
            }
        } catch (e) {}

        setLoading(false);
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
                <Snackbar alternate={true} show={snackbar.show} message={snackbar.message} />
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
                                        next={() => setView('addressAndPayment')}
                                    />
                                );
                            case 'addressAndPayment':
                                return <AddressAndPayment next={() => setView('reviewAndOrder')} />;
                            case 'reviewAndOrder':
                                return <ReviewAndOrder placeOrder={placeOrder} />;
                        }
                    })()}
                </div>
            </Style>
        </Wrapper>
    );
};

export default Checkout;

const ShoppingCart = ({next, cart}: {next: any; cart: cart}) => {
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
                                <td>${p.price}</td>
                                <td>${p.price}</td>
                            </tr>
                        ))}
                        <tr className={'order-summary-table-row'}>
                            <td style={{border: 'none'}} />
                            <td style={{border: 'none'}} />
                            <td style={{fontWeight: 600, border: 'none'}}>Subtotal</td>
                            <td style={{fontWeight: 600, border: 'none', color: '#ff4252'}}>
                                ${cart.total}
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
                                ${cart.total}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={'checkout-button-wrapper'}>
                <Button color={'#ff4252'} onClick={() => next()}>
                    Continue
                </Button>
            </div>
        </>
    );
};

const AdStyle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    & .inputs-wrapper {
        width: 80%;
        display: flex;
        justify-content: space-between;
    }
    & .inputs-container {
        flex-basis: 45%;
    }
    & .errors-text {
        color: red;
        margin-top: -0.8rem;
        margin-bottom: 1rem;
        display: block;
    }
`;

const Input = styled.input`
    background-color: transparent;
    border: none;
    margin-bottom: 1rem;
    border: solid 0.5px gray;
    border-radius: 3%;
    padding: 0.8rem 4px;
    color: gray;
    font-weight: 600;
    width: 100%;
    display: block;
    font-size: 14px;
    &:focus {
        outline: none;
    }
    & .error {
        border-color: red;
    }
    ::placeholder {
        color: rgba(0, 0, 0, 0.5);
    }
`;

const AddressAndPayment = ({next}: {next: any}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailSignIn, setEmailSignIn] = useState('');
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [password, setPassword] = useState('');
    const [passwordSignIn, setPasswordSignIn] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordSignIn: '',
        emailSignIn: '',
        phoneNumber: '',
        zipCode: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({show: false, message: ''});

    const validateSignUp = () => {
        let pass = true;
        const errors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: '',
            zipCode: '',
            address: '',
        };

        if (firstName.length <= 1) {
            pass = false;
            errors.firstName = 'First name is required';
        }
        if (lastName.length <= 1) {
            pass = false;
            errors.lastName = 'Last name is required';
        }
        if (email.length <= 1 || !emailTestString.test(email)) {
            pass = false;
            errors.email = 'Email is required and must be a valid email';
        }
        if (password.length < 6) {
            pass = false;
            errors.password = 'Password is required and must be at least six characters';
        }
        if (phoneNumber.length !== 11) {
            pass = false;
            errors.phoneNumber = 'Phone number is required and must be eleven digits';
        }
        if (zipCode.length <= 1) {
            pass = false;
            errors.zipCode = 'Zip Code is required';
        }
        if (address.length <= 10) {
            pass = false;
            errors.address = 'Address is required';
        }

        setErrors(e => ({...e, ...errors}));
        return pass;
    };

    const submitSignUp = async () => {
        if (!validateSignUp()) {
            return;
        }
        setLoading(true);
        const fields = {
            firstName,
            lastName,
            password,
            email,
            phoneNumber,
            zipCode,
            address,
        };

        try {
            const {status, data} = await Axios.post('/user', fields);
            if (status === 201 && data.status === 'success') {
                await sessionStorage.setItem('address', address);
                setSnackbar({show: true, message: 'Sign Up Successful'});
                setTimeout(() => {
                    next();
                }, 3000);
            }
        } catch (e) {
            const {response} = e as AxiosError;
            if (response) {
                const {status, data} = response;
                if (status === 422 && data.status === 'error') {
                    const err = data.errors as Array<{msg: string; param: string}>;
                    err.forEach(er => setErrors(e => ({...e, [er.param]: er.msg})));
                }
            }
        }

        setLoading(false);
    };

    const validateSignIn = () => {
        let pass = true;

        const errors = {
            passwordSignIn: '',
            emailSignIn: '',
        };

        if (emailSignIn.length <= 1 || !emailTestString.test(emailSignIn)) {
            pass = false;
            errors.emailSignIn = 'Email is required and must be a valid email';
        }
        if (passwordSignIn.length < 6) {
            pass = false;
            errors.passwordSignIn = 'Password is required and must be at least six characters';
        }
        setErrors(e => ({...e, ...errors}));
        return pass;
    };

    const submitSignIn = async () => {
        if (!validateSignIn()) {
            return;
        }
        setLoading(true);
        const d = {
            email: emailSignIn,
            password: passwordSignIn,
        };
        try {
            const {status, data} = await Axios.post('/user/login', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({show: true, message: 'Sign in Successful'});
                setTimeout(() => {
                    next();
                }, 3000);
            }
        } catch (e) {
            const err = e as AxiosError;
            const {response} = err;
            if (response) {
                const {status} = response;
                if (status === 401) {
                    setSnackbar({show: true, message: 'Email or Password incorrect'});
                }
            }
        }
        setLoading(false);
    };

    return (
        <>
            <AdStyle>
                <Snackbar alternate={true} show={snackbar.show} message={snackbar.message} />
                <Loading show={loading} />
                <div className={'inputs-wrapper'}>
                    <div className={'inputs-container'}>
                        <h1>Sign Up</h1>
                        <div className={'inputs'}>
                            <div>
                                <Input
                                    value={firstName}
                                    style={{borderColor: errors.firstName && 'red'}}
                                    type={'text'}
                                    placeholder={'First name'}
                                    onChange={e => setFirstName(e.target.value.trim())}
                                />
                                {errors.firstName && (
                                    <small className={'errors-text'}>{errors.firstName}</small>
                                )}
                            </div>
                            <Input
                                value={lastName}
                                placeholder={'Last name'}
                                style={{borderColor: errors.lastName && 'red'}}
                                onChange={e => setLastName(e.target.value.trim())}
                                type={'text'}
                            />
                            {errors.lastName && (
                                <small className={'errors-text'}>{errors.lastName}</small>
                            )}
                            <Input
                                value={email}
                                placeholder={'E-mail'}
                                type={'email'}
                                style={{borderColor: errors.email && 'red'}}
                                onChange={e => setEmail(e.target.value.trim())}
                            />
                            {errors.email && (
                                <small className={'errors-text'}>{errors.email}</small>
                            )}
                            <Input
                                value={password}
                                placeholder={'Password'}
                                type={'password'}
                                style={{borderColor: errors.password && 'red'}}
                                onChange={e => setPassword(e.target.value.trim())}
                            />
                            {errors.password && (
                                <small className={'errors-text'}>{errors.firstName}</small>
                            )}
                            <Input
                                value={phoneNumber}
                                placeholder={'Phone Number'}
                                type={'text'}
                                style={{borderColor: errors.phoneNumber && 'red'}}
                                onChange={e => setPhoneNumber(e.target.value.trim())}
                            />
                            {errors.phoneNumber && (
                                <small className={'errors-text'}>{errors.phoneNumber}</small>
                            )}
                            <Input
                                value={zipCode}
                                placeholder={'Zip Code'}
                                style={{borderColor: errors.zipCode && 'red'}}
                                type={'text'}
                                onChange={e => setZipCode(e.target.value.trim())}
                            />
                            {errors.zipCode && (
                                <small className={'errors-text'}>{errors.zipCode}</small>
                            )}
                            <Input
                                value={address}
                                placeholder={'Address'}
                                type={'text'}
                                style={{borderColor: errors.address && 'red'}}
                                onChange={e => setAddress(e.target.value)}
                            />
                            {errors.address && (
                                <small className={'errors-text'}>{errors.address}</small>
                            )}
                            <Button onClick={submitSignUp} color={'#ff4252'}>
                                Continue
                            </Button>
                        </div>
                    </div>
                    <div className={'inputs-container'}>
                        <h1>Sign In</h1>
                        <div>
                            <Input
                                value={emailSignIn}
                                placeholder={'E-mail'}
                                style={{borderColor: errors.emailSignIn && 'red'}}
                                onChange={e => setEmailSignIn(e.target.value.trim())}
                            />
                            <Input
                                value={passwordSignIn}
                                placeholder={'Password'}
                                type={'password'}
                                style={{borderColor: errors.passwordSignIn && 'red'}}
                                onChange={e => setPasswordSignIn(e.target.value.trim())}
                            />
                            <Button onClick={submitSignIn} color={'#ff4252'}>
                                Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </AdStyle>
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
`;

const ReviewAndOrder = ({placeOrder}: {placeOrder: any}) => {
    const [address, setAddress] = useState('');

    useEffect(() => {
        const ad = sessionStorage.getItem('address');
        setAddress(ad ? ad : '');
    }, []);

    return (
        <>
            <ReStyle>
                <div className={'wrapper'}>
                    <div>
                        <h1>Shipping Address</h1>
                        <p>{address}</p>
                    </div>
                    <div>
                        <h1>Total</h1>
                        <h2>50, 000</h2>
                        <Button color={'#ff4252'} onClick={placeOrder}>
                            Place Order &amp; Pay now
                        </Button>
                    </div>
                </div>
            </ReStyle>
        </>
    );
};
