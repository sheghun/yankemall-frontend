import React, {useState} from 'react';
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
import {makeStyles, useTheme} from '@material-ui/core/styles';
import backgroundImage from '../../assets/images/multiple-shipping-partners.png';
import Axios, {AxiosError} from 'axios';
import {Link} from 'react-router-dom';
import Snack from '../../components/snack';
import {RouteComponentProps} from 'react-router';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Moment} from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import MenuItem from '@material-ui/core/MenuItem';
import logoImage from '../../assets/images/eromalls-logo.png';
import Copyright from '../../components/Copyright';

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
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('YYY-MM-DD');
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
        if (birthDate === '') {
            pass = false;
            errors.birthDate = 'Date is incorrect';
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
            birthDate,
            phoneNumber: '234' + phoneNumber,
            gender,
        };
        try {
            const {status, data} = await Axios.post('/user', d);
            if (status === 201 && data.status === 'success') {
                setSnackbar({open: true, variant: 'success', message: 'Sign up Successful'});
                setTimeout(() => {
                    history.push('/dashboard/overview');
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

    return (
        <Grid container component="main" className={classes.root}>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
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
                                startAdornment: (
                                    <InputAdornment position="start">+234</InputAdornment>
                                ),
                            }}
                            margin="normal"
                        />
                        <TextField
                            margin="normal"
                            error={!!errors.password}
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            helperText={errors.password}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                            <KeyboardDatePicker
                                style={{width: '100%'}}
                                margin="normal"
                                variant={bigScreen ? 'inline' : 'dialog'}
                                id="birthDate-picker-dialog"
                                label="Birthday"
                                onFocus={e => e.target.blur()}
                                format="YYYY-MM-DD"
                                error={!!errors.birthDate}
                                helperText={errors.birthDate}
                                value={birthDate}
                                onChange={birthDate =>
                                    setBirthDate((birthDate as Moment).format('YYYY-MM-DD'))
                                }
                                KeyboardButtonProps={{
                                    'aria-label': 'change birthDate',
                                }}
                            />
                        </MuiPickersUtilsProvider>
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
                                startAdornment: (
                                    <InputAdornment position="start">Gender:</InputAdornment>
                                ),
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
                                <Link to={'/auth/signin'}>
                                    <Typography color={'primary'} variant="body2">
                                        {'Already have an account?     Sign In'}
                                    </Typography>
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignUp;
