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

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    pageTitle: {
        marginBottom: '3rem',
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

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Change Password
            </Typography>
            <Grid
                container
                direction={'column'}
                wrap={'nowrap'}
                style={{height: '100%'}}
                justify={'space-evenly'}
            >
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="adornment-password">Old Password</InputLabel>
                        <Input
                            id="adornment-password"
                            type={show.old ? 'text' : 'password'}
                            value={oldPassword}
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
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="adornment-password">Old Password</InputLabel>
                        <Input
                            id="adornment-password"
                            type={show.new ? 'text' : 'password'}
                            value={newPassword}
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
                        />
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
