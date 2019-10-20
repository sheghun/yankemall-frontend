import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Visibility from '@material-ui/icons/Visibility';
import Grid from '@material-ui/core/Grid';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Axios, {AxiosError} from 'axios';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Snack from '../../components/snack';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    pageTitle: {
        marginBottom: '3rem',
    },
    error: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        '& *': {
            fontSize: '14px',
            marginRight: '10px',
        },
    },
}));
const ChangePass = () => {
    const classes = useStyles();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [show, setShow] = useState({old: false, new: false});
    const [loading, setLoding] = useState(false);
    const [errors, setErrors] = useState({
        oldPassword: '',
        newPassword: {
            error: false,
            lowerCase: '',
            upperCase: '',
            number: '',
            length: '',
        },
    });

    const validate = () => {
        let pass = true;
        const err = {
            oldPassword: '',
            newPassword: {
                error: false,
                lowerCase: '',
                upperCase: '',
                number: '',
                length: '',
            },
        };
        switch (true) {
            // Check if password contain six characters
            case newPassword.length < 6:
                pass = false;
                err.newPassword.error = true;
                err.newPassword.length = 'Password should contain at least six characters';
                break;

            // Check if newPassword contains lowercase letter
            case !/[a-z]/.test(newPassword):
                pass = false;
                err.newPassword.error = true;
                err.newPassword.lowerCase =
                    'New Password should contain at least one lowercase letter';
                break;

            // Check if newPassword contain uppercase letter
            case !/[A-Z]/.test(newPassword):
                pass = false;
                err.newPassword.error = true;
                err.newPassword.upperCase =
                    ' New Password should contain at least one uppercase letters';
                break;

            // Check if newPassword contain a number
            case !/\d/.test(newPassword):
                pass = false;
                err.newPassword.error = true;
                err.newPassword.number = ' New Password should contain at least one number';
                break;
        }
        setErrors(err);
        return pass;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        const d = {
            newPassword,
            oldPassword,
        };
        try {
            const {status, data} = await Axios.post('/user/password', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Password changed successfully',
                });
            }
        } catch (error) {
            const {response} = error as AxiosError;
            if (response) {
                if (response.status === 422 && response.data.status === 'error') {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message: "Old Password doesn't match",
                    });
                    const err = response.data.errors as Array<{msg: string; param: string}>;
                    err.forEach(er => setErrors(e => ({...e, [er.param]: er.msg})));
                } else if (String(response.status).match(/^5/)) {
                    setSnackbar({
                        open: true,
                        variant: 'error',
                        message:
                            'An error occurred from our end please bear with us while we fix this',
                    });
                }
            }
        }
    };

    console.log(errors.newPassword);

    return (
        <Paper className={classes.paper}>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Typography variant={'h5'} className={classes.pageTitle}>
                Change Password
            </Typography>
            <Grid
                container
                // direction={'column'}
                // wrap={'nowrap'}
                style={{minHeight: '100%', width: '100%'}}
                component={'form'}
                onSubmit={submit}
                justify={'space-evenly'}
            >
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.oldPassword}>
                        <InputLabel htmlFor="old-password">Old Password</InputLabel>
                        <Input
                            id="old-password"
                            type={show.old ? 'text' : 'password'}
                            value={oldPassword}
                            name={'old-password'}
                            required
                            onChange={e => setOldPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShow(s => ({...s, old: !show.old}))}
                                    >
                                        {show.old ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {errors.oldPassword && (
                            <FormHelperText>{errors.oldPassword}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={errors.newPassword.error}>
                        <InputLabel htmlFor="new-password">New Password</InputLabel>
                        {
                            // @ts-ignore
                            <Input
                                id="new-password"
                                type={show.new ? 'text' : 'password'}
                                value={newPassword}
                                name={'new-password'}
                                required
                                onChange={e => setNewPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShow(s => ({...s, new: !show.new}))}
                                        >
                                            {show.new ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{
                                    minlength: 6,
                                }}
                            />
                        }

                        {errors.newPassword.error && (
                            <FormHelperText>
                                {errors.newPassword.lowerCase && (
                                    <small className={classes.error}>
                                        {errors.newPassword.lowerCase ? (
                                            <CancelIcon style={{color: 'red', fontSize: '14px'}} />
                                        ) : (
                                            <CheckCircleIcon
                                                style={{color: 'green', fontSize: '14px'}}
                                            />
                                        )}
                                        {errors.newPassword.lowerCase}
                                    </small>
                                )}
                                {errors.newPassword.upperCase && (
                                    <small className={classes.error}>
                                        {errors.newPassword.upperCase ? (
                                            <CancelIcon style={{color: 'red', fontSize: '14px'}} />
                                        ) : (
                                            <CheckCircleIcon
                                                style={{color: 'green', fontSize: '14px'}}
                                            />
                                        )}
                                        {errors.newPassword.upperCase}
                                    </small>
                                )}
                                {errors.newPassword.number && (
                                    <small className={classes.error}>
                                        {errors.newPassword.number ? (
                                            <CancelIcon style={{color: 'red', fontSize: '14px'}} />
                                        ) : (
                                            <CheckCircleIcon style={{color: 'green'}} />
                                        )}
                                        {errors.newPassword.number}
                                    </small>
                                )}
                                {errors.newPassword.length && (
                                    <small className={classes.error}>
                                        {errors.newPassword.length ? (
                                            <CancelIcon style={{color: 'red', fontSize: '14px'}} />
                                        ) : (
                                            <CheckCircleIcon style={{color: 'green'}} />
                                        )}
                                        {errors.newPassword.length}
                                    </small>
                                )}
                            </FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
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

export default ChangePass;
