import React, {useMemo, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {Helmet} from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import backgroundImage from '../../assets/images/multiple-shipping-partners.png';
import Axios, {AxiosError} from 'axios';
import {Link, Route} from 'react-router-dom';
import Snack from '../../components/snack';
import {RouteComponentProps} from 'react-router';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment, {Moment} from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import MenuItem from '@material-ui/core/MenuItem';
import logoImage from '../../assets/images/eromalls-logo.png';
import Copyright from '../../components/Copyright';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        marginTop: '-2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
        width: 100,
        height: 100,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp = ({history}: RouteComponentProps) => {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Link to={'/'}>
                        <Avatar className={classes.avatar}>
                            <img width={'100px'} src={logoImage} alt={'Yankeemall Logo'} />
                        </Avatar>
                    </Link>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Route
                        render={props => (
                            <SignUpForm
                                {...props}
                                navigate={() => history.push('/dashboard/overview')}
                            />
                        )}
                    />
                </div>
            </Grid>
        </Grid>
    );
};

export const SignUpForm = ({navigate}: RouteComponentProps & {navigate: any}) => {
    const classes = useStyles();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState({year: '', month: '', day: ''});
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        birthDate: '',
        gender: '',
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
            firstName: '',
            lastName: '',
            email: '',
            birthDate: '',
            password: '',
            phoneNumber: '',
            gender: '',
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
        if (phoneNumber.length !== 10) {
            pass = false;
            errors.phoneNumber = 'Phone number is required and must be eleven digits';
        }
        if (gender === '') {
            pass = false;
            errors.gender = 'Gender is required';
        }
        if (birthDate.year === '' || birthDate.month === '' || birthDate.day === '') {
            pass = false;
            errors.birthDate = 'Make you select your birth, year month and day';
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

        const d = {
            email,
            password,
            firstName,
            lastName,
            birthDate: `${birthDate.year}-${
                String(birthDate.month).length === 1
                    ? '0' + String(birthDate.month)
                    : birthDate.month
            }-${birthDate.day}`,
            phoneNumber: '234' + phoneNumber,
            gender,
        };
        try {
            const {status, data} = await Axios.post('/user', d);
            if (status === 201 && data.status === 'success') {
                setSnackbar({open: true, variant: 'success', message: 'Sign up Successful'});
                setTimeout(() => {
                    navigate();
                }, 2000);
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

    const renderYears = useMemo(() => {
        const years = [];
        for (let i = 2001; i >= 1940; i--) {
            years.push(<MenuItem value={i}>{i}</MenuItem>);
        }
        return years;
    }, []);

    const renderMonths = useMemo(
        () =>
            moment
                .monthsShort()
                .map((month, index) => <MenuItem value={index + 1}>{month}</MenuItem>),
        [],
    );

    const renderDays = useMemo(() => {
        let menuList = [];
        if (
            birthDate.month == '4' ||
            birthDate.month == '6' ||
            birthDate.month == '9' ||
            birthDate.month == '11'
        ) {
            // For month with 30 days
            // April June September November
            menuList = [];
            for (let i = 1; i <= 30; i++) {
                menuList.push(
                    <MenuItem key={i} value={i}>
                        {i.toString().length == 2 ? i : 0 + '' + i}
                    </MenuItem>,
                );
            }
        } else if (birthDate.month == '2') {
            // For the month of February
            menuList = [];
            for (let i = 1; i <= 29; i++) {
                menuList.push(
                    <MenuItem key={i} value={i}>
                        {i.toString().length == 2 ? i : 0 + '' + i}
                    </MenuItem>,
                );
            }
        } else {
            // For other months
            menuList = [];
            for (let i = 1; i <= 31; i++) {
                menuList.push(
                    <MenuItem key={i} value={i}>
                        {i.toString().length == 2 ? i : 0 + '' + i}
                    </MenuItem>,
                );
            }
        }
        return menuList;
    }, [birthDate.month]);
    return (
        <>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <form className={classes.form} onSubmit={submit}>
                <Grid container justify={'center'}>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            margin={'normal'}
                            required={true}
                            id={'first-name'}
                            type={'text'}
                            value={firstName}
                            error={!!errors.firstName}
                            onChange={e => setFirstName(e.target.value)}
                            fullWidth
                            label={'First Name'}
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            id={'last-name'}
                            margin={'normal'}
                            value={lastName}
                            required
                            error={!!errors.lastName}
                            onChange={e => setLastName(e.target.value)}
                            type={'text'}
                            fullWidth
                            label={'Last Name'}
                        />
                    </Grid>
                </Grid>
                <TextField
                    required={true}
                    fullWidth
                    id={'email'}
                    margin={'normal'}
                    error={!!errors.email}
                    value={email}
                    helperText={errors.email}
                    onChange={e => setEmail(e.target.value)}
                    type={'email'}
                    label={'E-mail'}
                />
                <TextField
                    id="Phone Number"
                    label="Phone Number"
                    required
                    type={'text'}
                    value={phoneNumber}
                    error={!!errors.phoneNumber}
                    onChange={changePhoneNumber}
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+234</InputAdornment>,
                    }}
                    margin="normal"
                />
                <FormControl fullWidth error={!!errors.password}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        name={'password'}
                        required
                        onChange={e => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                </FormControl>

                <Grid container>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="year">Year</InputLabel>
                            <Select
                                id="year"
                                value={birthDate.year}
                                error={!!errors.birthDate}
                                onChange={e =>
                                    setBirthDate(b => ({
                                        ...b,
                                        year: e.target.value as string,
                                    }))
                                }
                            >
                                {renderYears}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="month">Month</InputLabel>
                            <Select
                                id="month"
                                value={birthDate.month}
                                error={!!errors.birthDate}
                                onChange={e =>
                                    setBirthDate(b => ({
                                        ...b,
                                        month: e.target.value as string,
                                    }))
                                }
                            >
                                {renderMonths}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="day">Day</InputLabel>
                            <Select
                                id="day"
                                error={!!errors.birthDate}
                                value={birthDate.day}
                                onChange={e =>
                                    setBirthDate(b => ({
                                        ...b,
                                        day: e.target.value as string,
                                    }))
                                }
                            >
                                {renderDays}
                            </Select>
                        </FormControl>
                    </Grid>
                    {errors.birthDate && (
                        <Grid item xs={12}>
                            <Typography color={'error'} variant={'subtitle2'}>
                                {errors.birthDate}
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                <TextField
                    select
                    label="Gender"
                    fullWidth
                    margin={'normal'}
                    required
                    error={!!errors.gender}
                    helperText={errors.gender}
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">Gender:</InputAdornment>,
                    }}
                >
                    {['Male', 'Female'].map((g, i) => (
                        <MenuItem key={i} value={g}>
                            {g}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    className={classes.submit}
                >
                    {loading ? <CircularProgress /> : 'Sign Up'}
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to={'#'}>
                            <Typography color={'primary'} variant="body2" onClick={navigate}>
                                {'Already have an account?     Sign In'}
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </form>
        </>
    );
};

export default SignUp;
