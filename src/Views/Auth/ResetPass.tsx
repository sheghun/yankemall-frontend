import React, {useEffect, useState} from 'react';
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
import Snack from '../../components/snack';
import {Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import queryString from 'query-string';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            Yankeemall
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function ResetPass({history, location}: RouteComponentProps) {
    const classes = useStyles();

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [errors, setErrors] = useState({
        password: {
            error: false,
            lowerCase: '',
            upperCase: '',
            number: '',
            length: '',
        },
        confirmPassword: '',
    });

    useEffect(() => {
        const queryUrl = queryString.parse(location.search);
        const token = !!queryUrl.token ? queryUrl.token : '';
        if (!token) history.push('/');

        setToken(token as string);
    }, [location]);

    const validate = () => {
        let pass = true;
        // Dont show
        const err = {
            confirmPassword: '',
            password: {
                error: false,
                lowerCase: '',
                upperCase: '',
                number: '',
                length: '',
            },
        };
        switch (true) {
            // Check if password contain six characters
            case password.length < 6:
                pass = false;
                err.password.error = true;
                err.password.length = 'Password should contain at least six characters';
                break;

            // Check if password contains lowercase letter
            case !/[a-z]/.test(password):
                pass = false;
                err.password.error = true;
                err.password.lowerCase =
                    'New Password should contain at least one lowercase letter';
                break;

            // Check if password contain uppercase letter
            case !/[A-Z]/.test(password):
                pass = false;
                err.password.error = true;
                err.password.upperCase =
                    ' New Password should contain at least one uppercase letters';
                break;

            // Check if password contain a number
            case !/\d/.test(password):
                pass = false;
                err.password.error = true;
                err.password.number = ' New Password should contain at least one number';
                break;
        }

        if (confirmPassword !== password) {
            pass = false;
            err.confirmPassword = 'Passwords does not match';
        }

        setErrors(err);
        return pass;
    };
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        const d = {
            token,
            password,
        };
        try {
            const {status, data} = await Axios.post('/user/resetpass', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({open: true, variant: 'success', message: 'Password reset successful'});
            }
        } catch (e) {
            const {response} = e as AxiosError;
            if (response) {
                const {status, data} = response;
                if (status === 401 && data.status === 'error') {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message: 'Link expired restart the process again',
                    });
                }
            }
        }
        setLoading(false);
    };

    return (
        <Grid container component="main" justify={'center'} className={classes.root}>
            <Helmet>
                <title>Reset Password</title>
            </Helmet>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Reset Your Password
                    </Typography>
                    <form className={classes.form} onSubmit={submit}>
                        <TextField
                            margin="normal"
                            type={'password'}
                            required
                            fullWidth
                            error={errors.password.error}
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="password"
                            helperText={
                                errors.password.error && (
                                    <>
                                        {errors.password.lowerCase && (
                                            <>
                                                {errors.password.lowerCase ? (
                                                    <CancelIcon
                                                        style={{color: 'red', fontSize: '14px'}}
                                                    />
                                                ) : (
                                                    <CheckCircleIcon
                                                        style={{
                                                            color: 'green',
                                                            fontSize: '14px',
                                                        }}
                                                    />
                                                )}
                                                {errors.password.lowerCase}
                                            </>
                                        )}
                                        {errors.password.upperCase && (
                                            <>
                                                {errors.password.upperCase ? (
                                                    <CancelIcon
                                                        style={{color: 'red', fontSize: '14px'}}
                                                    />
                                                ) : (
                                                    <CheckCircleIcon
                                                        style={{
                                                            color: 'green',
                                                            fontSize: '14px',
                                                        }}
                                                    />
                                                )}
                                                {errors.password.upperCase}
                                            </>
                                        )}
                                        {errors.password.number && (
                                            <>
                                                {errors.password.number ? (
                                                    <CancelIcon
                                                        style={{color: 'red', fontSize: '14px'}}
                                                    />
                                                ) : (
                                                    <CheckCircleIcon style={{color: 'green'}} />
                                                )}
                                                {errors.password.number}
                                            </>
                                        )}
                                        {errors.password.length && (
                                            <>
                                                {errors.password.length ? (
                                                    <CancelIcon
                                                        style={{color: 'red', fontSize: '14px'}}
                                                    />
                                                ) : (
                                                    <CheckCircleIcon style={{color: 'green'}} />
                                                )}
                                                {errors.password.length}
                                            </>
                                        )}
                                    </>
                                )
                            }
                            autoFocus
                            onChange={e => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            type={'password'}
                            required
                            fullWidth
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            id="confirmPassword"
                            label="Confirm Password"
                            name="confirmPassword"
                            autoComplete="confirmPassword"
                            autoFocus
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            className={classes.submit}
                        >
                            {loading ? <CircularProgress /> : 'Reset'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/auth/signin">
                                    <Typography variant="body2" color={'primary'}>
                                        Sign In
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={'/auth/signup'}>
                                    <Typography color={'primary'} variant="body2">
                                        {"Don't have an account? Sign Up"}
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
}
