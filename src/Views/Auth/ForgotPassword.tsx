import React, {useState} from 'react';
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

export default function SignIn({}: RouteComponentProps) {
    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [errors, setErrors] = useState({
        email: '',
    });

    const validate = () => {
        let pass = true;

        const errors = {
            email: '',
        };
        if (email.length <= 1 || !emailTestString.test(email)) {
            pass = false;
            errors.email = 'Email is required and must be a valid email';
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
        };
        try {
            const {status, data} = await Axios.post('/user/forgotpass', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Link sent to email if it exists',
                });
            }
        } catch (e) {
            const {response} = e as AxiosError;
            if (response) {
                const {status, data} = response;
                console.log(status, data);
                if (status === 400 && data.status === 'error') {
                    alert('working');
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message: "Link couldn't send check your network connection",
                    });
                }
            }
        }
        setLoading(false);
    };

    return (
        <Grid container component="main" className={classes.root}>
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
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Forgot Password
                        <Typography variant={'subtitle2'}>
                            Input your email below, we will send you a link to reset your password
                        </Typography>
                    </Typography>
                    <form className={classes.form} onSubmit={submit}>
                        <TextField
                            variant="outlined"
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
