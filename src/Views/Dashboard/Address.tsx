import React, {useContext, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
import BookSvg from '../../assets/icons/address.svg';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Route, RouteComponentProps} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Axios, {AxiosError} from 'axios';
import {Link} from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';
import {Helmet} from 'react-helmet';
import Snack from '../../components/snack';
import {DashboardContext} from '../../Context';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import queryString from 'query-string';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    pageTitle: {
        marginBottom: '3rem',
    },
    card: {
        width: '100%',
        border: 'solid 1px #EDEDED',
    },
    title: {
        fontSize: 14,
        position: 'relative',
        textTransform: 'uppercase',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
    },
    pos: {
        marginBottom: 12,
    },
}));
const Address = (props: RouteComponentProps) => {
    return (
        <>
            <Route
                exact={true}
                path={'/dashboard/address'}
                render={() => <ShowAddress {...props} />}
            />
            <Route path={'/dashboard/address/add'} render={() => <AddAddress {...props} />} />
            <Route path={'/dashboard/address/edit'} render={() => <EditAddress {...props} />} />
        </>
    );
};

export default Address;

const ShowAddress = ({}: RouteComponentProps) => {
    const classes = useStyles();

    const {address, phoneNumber, firstName, lastName} = useContext(DashboardContext);

    return (
        <Paper className={classes.paper}>
            <Typography
                variant={'h5'}
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                }}
                className={classes.pageTitle}
            >
                Address Book
                {address.length !== 0 && (
                    <Link to={'/dashboard/address/add'}>
                        <Button color={'primary'} variant={'contained'} fullWidth>
                            Add New Address
                        </Button>
                    </Link>
                )}
            </Typography>
            <Grid container spacing={3} justify={'space-evenly'}>
                {address.length === 0 ? (
                    <Grid container justify={'center'}>
                        <img alt={'book'} height={'100px'} src={BookSvg} />
                        <Grid item xs={12} />
                        <Grid item xs={8} md={6} justify={'center'}>
                            <Typography
                                variant={'body2'}
                                align={'center'}
                                style={{fontWeight: 600}}
                            >
                                You have not added any address yet!
                            </Typography>
                            <Typography variant={'body1'} align={'center'}>
                                Add your shipping addresses here for a fast purchase experience! You
                                will be able to add, modify or delete them at any time.
                            </Typography>
                            <Link to={'/dashboard/address/add'}>
                                <Button
                                    color={'primary'}
                                    style={{marginTop: '2rem'}}
                                    variant={'contained'}
                                    fullWidth
                                >
                                    Add New Address
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                ) : (
                    address.map((ad, i) => (
                        <Grid item xs={12} md={5}>
                            <Card raised={false} elevation={0} className={classes.card}>
                                <CardContent>
                                    <Typography className={classes.pos} style={{fontSize: '12px'}}>
                                        {address.length === 0 ? (
                                            'You have not added an address yet'
                                        ) : (
                                            <>
                                                {firstName} {lastName}
                                                <br />
                                                {ad.address}
                                                <br />
                                                {'+' + phoneNumber}
                                                <br />
                                                {ad.zipCode}
                                            </>
                                        )}
                                    </Typography>

                                    {ad.default && (
                                        <Typography
                                            variant="body1"
                                            color={'primary'}
                                            style={{fontWeight: 500}}
                                        >
                                            Default address
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions style={{borderTop: 'solid 1px #ededed'}}>
                                    <Typography className={classes.title}>
                                        <Button color={'primary'} disabled={ad.default}>
                                            Set as Default
                                        </Button>
                                        <Link
                                            to={`/dashboard/address/edit?id=${ad.id}`}
                                            className={classes.icon}
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
                    ))
                )}
            </Grid>
        </Paper>
    );
};

const AddAddress = ({}: RouteComponentProps) => {
    const classes = useStyles();

    const context = useContext(DashboardContext);
    const setContextObject = context.setUserObject;
    const contextAddress = context.address;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [region, setRegion] = useState('');
    const [setAsDefault, setSetAsDefault] = useState(false);
    const [errors, setErrors] = useState({
        firstName,
        lastName,
        address,
        zipCode,
        region,
        state,
        phoneNumber,
    });

    const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Check if it contains number or length is greater than 10 and remove the first zero from value
        if (/\D/.test(value) || value.length > 10 || (value.length === 1 && value === '0')) return;

        setPhoneNumber(value);
    };

    const validate = () => {
        let pass = true;
        const errors = {
            region: '',
            firstName: '',
            lastName: '',
            address: '',
            zipCode: '',
            state: '',
            phoneNumber: '',
        };

        if (firstName.length <= 1) {
            pass = false;
            errors.firstName = 'First name is required';
        }
        if (lastName.length <= 1) {
            pass = false;
            errors.lastName = 'Last name is required';
        }
        if (region.length <= 1) {
            pass = false;
            errors.region = 'Region is required';
        }
        if (phoneNumber.length !== 10) {
            pass = false;
            errors.phoneNumber = 'Phone number is required and must be 10 digits ';
        }
        if (address === '') {
            pass = false;
            errors.address = 'Gender is required';
        }
        if (zipCode === '') {
            pass = false;
            errors.zipCode = 'Zip code is required';
        }
        if (state === '') {
            pass = false;
            errors.state = 'State is incorrect';
        }
        setErrors(e => ({...e, ...errors}));
        return pass;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const d = {
                firstName,
                lastName,
                phoneNumber: `234${phoneNumber}`,
                zipCode,
                address,
                region,
                state,
                makeDefault: setAsDefault,
            };
            const {status, data} = await Axios.post('/user/address', d);
            if (status === 201 && data.status === 'success') {
                const newAddress = {
                    id: data.data.id,
                    firstName,
                    lastName,
                    phoneNumber,
                    zipCode,
                    state,
                    region,
                    address,
                    default: data.data.default,
                } as Address;
                const updatedAddresses = [...contextAddress, newAddress];
                // @ts-ignore
                setContextObject(s => ({...s, address: updatedAddresses}));

                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Address Created Successfully',
                });
            }
        } catch (e) {
            const {response} = e as AxiosError;
            if (response) {
                if (String(response.status).match(/^5/)) {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message:
                            'An error occurred from our end please bear with us, while we fix this',
                    });
                }
            }
        }

        setLoading(false);
    };

    return (
        <Paper className={classes.paper}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
            >
                <Link to={'/dashboard/address'}>
                    <IconButton color={'primary'} aria-label={'Edit your details'}>
                        <ArrowBackIcon style={{marginRight: '1rem'}} fontSize={'large'} />
                    </IconButton>
                </Link>
                Add Address
            </Typography>
            <Grid container spacing={3} justify={'center'} component={'form'} onSubmit={submit}>
                <Grid item xs={12} sm={5}>
                    <TextField
                        name={'first-name'}
                        id={'first-name'}
                        margin={'normal'}
                        required
                        type={'text'}
                        error={!!errors.firstName}
                        onChange={e => setFirstName(e.target.value)}
                        fullWidth
                        label={'First Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        name={'last-name'}
                        id={'last-name'}
                        margin={'normal'}
                        required
                        type={'text'}
                        error={!!errors.lastName}
                        onChange={e => setLastName(e.target.value)}
                        fullWidth
                        label={'Last Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="phone-number"
                        name="phone-number"
                        label="Phone Number"
                        fullWidth
                        required={true}
                        type={'text'}
                        value={phoneNumber}
                        helperText={errors.phoneNumber}
                        error={!!errors.phoneNumber}
                        onChange={changePhoneNumber}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+234</InputAdornment>,
                        }}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="zip-code"
                        name="zip-code"
                        label="Zip Code"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={zipCode}
                        helperText={errors.zipCode}
                        onChange={e => setZipCode(e.target.value)}
                        error={!!errors.zipCode}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id="address"
                        name="address"
                        label="Address"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        helperText={errors.address}
                        error={!!errors.address}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="region"
                        name="region"
                        label="Region"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        helperText={errors.state}
                        error={!!errors.state}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        select
                        label="State"
                        fullWidth
                        margin={'normal'}
                        required
                        error={!!errors.state}
                        helperText={errors.state}
                        value={state}
                        onChange={e => setState(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">State:</InputAdornment>
                            ),
                        }}
                    >
                        {['Male', 'Female'].map((g, i) => (
                            <MenuItem key={i} value={g}>
                                {g}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={10}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={setAsDefault}
                                color={'primary'}
                                onChange={e => setSetAsDefault(e.target.checked)}
                                value={'setAsDefault'}
                            />
                        }
                        label="Set as Default Address"
                    />
                </Grid>
                <Grid item xs={10}>
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        disabled={loading}
                        type={'submit'}
                        fullWidth={true}
                    >
                        {loading ? <CircularProgress /> : 'Save'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

const EditAddress = ({location}: RouteComponentProps) => {
    const classes = useStyles();

    const context = useContext(DashboardContext);
    const contextAddress = context.address;
    const setContextObject = context.setUserObject;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [state, setState] = useState('');
    const [region, setRegion] = useState('');
    const [setAsDefault, setSetAsDefault] = useState(false);
    const [errors, setErrors] = useState({
        firstName,
        lastName,
        address,
        zipCode,
        region,
        state,
        phoneNumber,
    });

    useEffect(() => {
        const id = Number(queryString.parse(location.search).id);
        // Retrieve current address from the address array;
        const curAddress = contextAddress.find(address => address.id === id) as Address;
        setFirstName(curAddress.firstName);
        setLastName(curAddress.lastName);
        setPhoneNumber(curAddress.phoneNumber);
        setRegion(curAddress.region);
        setState(curAddress.state);
        setZipCode(curAddress.zipCode);
        setSetAsDefault(curAddress.default);
    }, []);

    const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Check if it contains number or length is greater than 10 and remove the first zero from value
        if (/\D/.test(value) || value.length > 10 || (value.length === 1 && value === '0')) return;

        setPhoneNumber(value);
    };

    const validate = () => {
        let pass = true;
        const errors = {
            region: '',
            firstName: '',
            lastName: '',
            address: '',
            zipCode: '',
            state: '',
            phoneNumber: '',
        };

        if (firstName.length <= 1) {
            pass = false;
            errors.firstName = 'First name is required';
        }
        if (lastName.length <= 1) {
            pass = false;
            errors.lastName = 'Last name is required';
        }
        if (region.length <= 1) {
            pass = false;
            errors.region = 'Region is required';
        }
        if (phoneNumber.length !== 10) {
            pass = false;
            errors.phoneNumber = 'Phone number is required and must be 10 digits ';
        }
        if (address === '') {
            pass = false;
            errors.address = 'Gender is required';
        }
        if (zipCode === '') {
            pass = false;
            errors.zipCode = 'Zip code is required';
        }
        if (state === '') {
            pass = false;
            errors.state = 'State is incorrect';
        }
        setErrors(e => ({...e, ...errors}));
        return pass;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const d = {
                firstName,
                lastName,
                phoneNumber,
                zipCode,
                address,
                region,
                state,
                makeDefault: setAsDefault,
            };
            const {status, data} = await Axios.post('/user/address', d);
            if (status === 201 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Address Created Successfully',
                });
            }
        } catch (e) {
            const {response} = e as AxiosError;
            if (response) {
                if (String(response.status).match(/^5/)) {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message:
                            'An error occurred from our end please bear with us, while we fix this',
                    });
                }
            }
        }

        setLoading(false);
    };

    return (
        <Paper className={classes.paper}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Typography
                variant={'h5'}
                className={classes.pageTitle}
                style={{display: 'flex', alignItems: 'center'}}
            >
                <Link to={'/dashboard/address'}>
                    <IconButton color={'primary'} aria-label={'Edit your details'}>
                        <ArrowBackIcon style={{marginRight: '1rem'}} fontSize={'large'} />
                    </IconButton>
                </Link>
                Add Address
            </Typography>
            <Grid container spacing={3} justify={'center'} component={'form'} onSubmit={submit}>
                <Grid item xs={12} sm={5}>
                    <TextField
                        name={'first-name'}
                        id={'first-name'}
                        margin={'normal'}
                        required
                        type={'text'}
                        error={!!errors.firstName}
                        onChange={e => setFirstName(e.target.value)}
                        fullWidth
                        label={'First Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        name={'last-name'}
                        id={'last-name'}
                        margin={'normal'}
                        required
                        type={'text'}
                        error={!!errors.lastName}
                        onChange={e => setLastName(e.target.value)}
                        fullWidth
                        label={'Last Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="phone-number"
                        name="phone-number"
                        label="Phone Number"
                        fullWidth
                        required={true}
                        type={'text'}
                        value={phoneNumber}
                        helperText={errors.phoneNumber}
                        error={!!errors.phoneNumber}
                        onChange={changePhoneNumber}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+234</InputAdornment>,
                        }}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="zip-code"
                        name="zip-code"
                        label="Zip Code"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={zipCode}
                        helperText={errors.zipCode}
                        onChange={e => setZipCode(e.target.value)}
                        error={!!errors.zipCode}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        id="address"
                        name="address"
                        label="Address"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        helperText={errors.address}
                        error={!!errors.address}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="region"
                        name="region"
                        label="Region"
                        required={true}
                        fullWidth
                        type={'text'}
                        value={region}
                        onChange={e => setRegion(e.target.value)}
                        helperText={errors.state}
                        error={!!errors.state}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        select
                        label="State"
                        fullWidth
                        margin={'normal'}
                        required
                        error={!!errors.state}
                        helperText={errors.state}
                        value={state}
                        onChange={e => setState(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">State:</InputAdornment>
                            ),
                        }}
                    >
                        {['Male', 'Female'].map((g, i) => (
                            <MenuItem key={i} value={g}>
                                {g}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={10}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={setAsDefault}
                                color={'primary'}
                                onChange={e => setSetAsDefault(e.target.checked)}
                                value={'setAsDefault'}
                            />
                        }
                        label="Set as Default Address"
                    />
                </Grid>
                <Grid item xs={10}>
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        disabled={loading}
                        type={'submit'}
                        fullWidth={true}
                    >
                        {loading ? <CircularProgress /> : 'Save'}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
