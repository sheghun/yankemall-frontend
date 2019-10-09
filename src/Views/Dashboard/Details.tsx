import React, {useState} from 'react';
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
    const smallScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const emailTestString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [gender, setGender] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        date: '',
        phoneNumber: '',
        zipCode: '',
        address: '',
    });

    const changePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Check if it contains number or length is greater than 10 and remove the first zero from value
        if (/\D/.test(value) || value.length > 10 || (value.length === 1 && value === '0')) return;

        setPhoneNumber(value);
    };

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Details
            </Typography>

            <Grid component={'form'} container spacing={3}>
                <Grid item xs={12} sm={5}>
                    <TextField
                        margin={'normal'}
                        required={true}
                        id={'first-name'}
                        type={'text'}
                        value={firstName}
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
                        value={lastName}
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
                        margin={'normal'}
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
                        id="standard-search"
                        label="Phone Number"
                        type={'text'}
                        value={phoneNumber}
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
                        id={'zip-code'}
                        margin={'normal'}
                        error={!!errors.zipCode}
                        value={email}
                        onChange={e => setZipCode(e.target.value)}
                        type={'text'}
                        className={classes.inputs}
                        label={'Zip Code'}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        select
                        label="Gender"
                        className={classes.inputs}
                        margin={'normal'}
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
                <Grid item xs={12}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <KeyboardDatePicker
                            style={{width: '100%'}}
                            disableToolbar={smallScreen}
                            margin="normal"
                            id="date-picker-dialog"
                            label="Birthday"
                            onFocus={e => e.target.blur()}
                            format="YYYY-MM-DD"
                            value={date}
                            onChange={date => setDate((date as Moment).format('YYYY-MM-DD'))}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                    <Button color={'primary'} variant={'contained'} fullWidth={true}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Details;
