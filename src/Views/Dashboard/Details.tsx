import React, {useContext, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import moment, {Moment} from 'moment';
import {DashboardContext} from '../../Context';
import CircularProgress from '@material-ui/core/CircularProgress';
import Axios, {AxiosError} from 'axios';
import Snack from '../../components/snack';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
        '& .MuiInput-formControl': {
            minHeight: '30px !important',
        },
    },
    pageTitle: {
        marginBottom: '3rem',
    },
    inputs: {
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));
const Details = () => {
    const classes = useStyles();
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const context = useContext(DashboardContext);

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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState(moment().format('YYYY-MM-DD'));
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        gender: '',
        phoneNumber: '',
    });

    useEffect(() => {
        setFirstName(context.firstName);
        setLastName(context.lastName);
        setEmail(context.email);
        setPhoneNumber(context.phoneNumber.substring(3));
        setBirthDate(moment(context.birthDate).format('YYYY-MM-DD'));
        setGender(context.gender);
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
            firstName,
            lastName,
            birthDate,
            phoneNumber: '234' + phoneNumber,
            gender,
        };
        try {
            const {status, data} = await Axios.put('/user', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Details updated successfully',
                });
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
        <Paper className={classes.paper}>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Typography variant={'h5'} className={classes.pageTitle}>
                Details
            </Typography>

            <Grid component={'form'} container spacing={3} onSubmit={submit} justify={'center'}>
                <Grid item xs={12} sm={5}>
                    <TextField
                        margin={'normal'}
                        required={true}
                        id={'first-name'}
                        type={'text'}
                        value={firstName}
                        name={'first-name'}
                        helperText={errors.firstName}
                        error={!!errors.firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={classes.inputs}
                        label={'First Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id={'last-name'}
                        margin={'normal'}
                        required={true}
                        value={lastName}
                        helperText={errors.lastName}
                        error={!!errors.lastName}
                        onChange={e => setLastName(e.target.value)}
                        type={'text'}
                        className={classes.inputs}
                        label={'Last Name'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id={'email'}
                        name={'email'}
                        margin={'normal'}
                        required={true}
                        helperText={errors.email}
                        disabled={true}
                        style={{
                            cursor: 'not-allowed',
                        }}
                        error={!!errors.email}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type={'email'}
                        className={classes.inputs}
                        label={'E-mail'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        id="phone-number"
                        name="phone-number"
                        label="Phone Number"
                        required={true}
                        type={'text'}
                        value={phoneNumber}
                        helperText={errors.phoneNumber}
                        error={!!errors.phoneNumber}
                        onChange={changePhoneNumber}
                        className={classes.inputs}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+234</InputAdornment>,
                        }}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        select
                        id={'gender'}
                        name={'gender'}
                        required={true}
                        label="Gender"
                        className={classes.inputs}
                        margin={'normal'}
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
                </Grid>
                <Grid item xs={12} sm={5}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            style={{width: '100%'}}
                            variant={bigScreen ? 'inline' : 'dialog'}
                            margin="normal"
                            id="birth-date"
                            name="birth-date"
                            required={true}
                            label="Birthday"
                            onFocus={e => e.target.blur()}
                            format="YYYY-MM-DD"
                            error={!!errors.birthDate}
                            helperText={errors.birthDate}
                            value={birthDate}
                            onChange={date => setBirthDate((date as Moment).format('YYYY-MM-DD'))}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        color={'primary'}
                        variant={'contained'}
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

export default Details;
