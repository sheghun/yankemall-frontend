import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import {Helmet} from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import queryString from 'query-string';
import {makeStyles} from '@material-ui/core/styles';
import backgroundImage from '../../assets/images/multiple-shipping-partners.png';
import Axios, {AxiosError} from 'axios';
import Snack from '../../components/snack';
import {Link} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
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

export default function SignIn({history, location}: RouteComponentProps) {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [returnUrl, setReturnUrl] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        /**
         * Next line of code gets the returnUrl parameter and redirects to it
         */
        // Check if the former url is the logout url redirect to the dashboard
        const queryUrl = queryString.parse(location.search);
        let url = !queryUrl.returnUrl
            ? '/dashboard/overview'
            : queryUrl.returnUrl === '/dashboard/logout'
            ? '/dashboard/overview'
            : queryUrl.returnUrl;

        /**
         * Check if the queryUrl contains other parameters e.g ?return=/dashboard/overview&name=segun
         */
        if (Object.keys(queryUrl).length > 1 && typeof queryUrl === 'object') {
            url += '?';
            for (const fragments in queryUrl) {
                if (queryUrl[fragments] && queryUrl[fragments] != null) {
                    if (fragments === 'returnUrl') {
                        continue;
                    }
                    // @ts-ignore
                    url += fragments + '=' + queryUrl[fragments] + '&';
                }
            }
        }

        setReturnUrl(url as string);
    }, [location.search]);

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
                setTimeout(() => {
                    history.push(returnUrl);
                }, 2000);
            }
        } catch (e) {
            const err = e as AxiosError;
            const {response} = err;
            if (response) {
                const {status} = response;
                if (status === 401) {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message: 'Email or Password incorrect',
                    });
                }
            }
        }
        setLoading(false);
    };

    return (
        <Grid container component="main" className={classes.root}>
            <Helmet>
                <title>Sign in</title>
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
                        Sign In
                    </Typography>
                    <form className={classes.form} onSubmit={submit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
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
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            color={'secondary'}
                            disabled={loading}
                            style={{fontWeight: 600}}
                            className={classes.submit}
                        >
                            {loading ? <CircularProgress /> : 'Sign in'}
                        </Button>
                        <Grid container style={{marginTop: '2rem'}}>
                            <Grid item xs={12} sm={6}>
                                <Link to="/auth/forgotpass">
                                    <Typography variant="body2" align={'center'} color={'primary'}>
                                        Forgot password?
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Link to={'/auth/signup'}>
                                    <Typography color={'primary'} align={'center'} variant="body2">
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
