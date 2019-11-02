import React, {useContext, useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import {Link} from 'react-router-dom';
import Axios from 'axios';
import {AdminContext} from '../../Context';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Snack from '../../components/snack';

const useStyles = makeStyles(theme => ({
    pageTitle: {
        marginBottom: '3rem',
    },
    card: {
        width: '100%',
        border: 'solid 1px #EDEDED',
    },
    paper: {
        padding: theme.spacing(2),
        height: '100%',
        paddingBottom: '2rem',
    },
    icon: {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        marginTop: '-1rem',
        position: 'absolute',
        right: '0',
    },
    title: {
        fontSize: 14,
        position: 'relative',
        borderBottom: 'solid 1px #ededed',
        textTransform: 'uppercase',
    },
    pos: {
        marginBottom: 12,
    },
}));

const Overview = () => {
    const classes = useStyles();

    const {users, orders, exchangeRate, setAdminObject} = useContext(AdminContext);
    const [editExchangeRate, setEditExchangeRate] = useState(false);
    const [exchangeInput, setExchangeInput] = useState('' as string | number);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        exchangeInput: '',
    });

    useEffect(() => {
        setExchangeInput(exchangeRate);
    }, [exchangeRate]);

    const updateExchangeRate = async () => {
        if (exchangeInput == '') {
            setErrors({exchangeInput: "Can't be empty"});
            return;
        }
        setLoading(true);
        try {
            const {status, data} = await Axios.post('/admin/exchangeRate', {
                exchangeRate: Number(exchangeInput),
            });
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'Exchange rate updated successfully',
                });
                setEditExchangeRate(false);
                setAdminObject(a => ({...a, exchangeRate: Number(exchangeInput)}));
            }
        } catch (e) {}
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
                Overview
            </Typography>
            <Grid container={true} justify={'space-evenly'} spacing={3}>
                <Grid item={true} xs={12} sm={5}>
                    <Card raised={false} elevation={0} className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Exchange Rate
                                {editExchangeRate ? (
                                    <Button onClick={updateExchangeRate}>
                                        {loading ? <CircularProgress /> : 'Save'}
                                    </Button>
                                ) : (
                                    <IconButton
                                        color={'primary'}
                                        onClick={() => setEditExchangeRate(!editExchangeRate)}
                                        aria-label={'Edit your details'}
                                        className={classes.icon}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Typography>
                            {editExchangeRate ? (
                                <TextField
                                    value={exchangeInput}
                                    onChange={e => setExchangeInput(e.target.value)}
                                    error={!!errors.exchangeInput}
                                    helperText={errors.exchangeInput}
                                    inputProps={{
                                        style: {
                                            fontSize: '34px',
                                        },
                                    }}
                                />
                            ) : (
                                <Typography
                                    align={'center'}
                                    variant="h4"
                                    style={{fontWeight: 500, marginTop: '1rem'}}
                                >
                                    ₦{exchangeRate}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card raised={false} elevation={0} className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Users
                            </Typography>
                            <Typography
                                align={'center'}
                                variant="h4"
                                style={{fontWeight: 500, marginTop: '1rem'}}
                            >
                                {users.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link to={'/superAdmin/tl/users'}>
                                <Button size="small" color={'primary'}>
                                    View Users
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card raised={false} elevation={0} className={classes.card}>
                        <CardContent>
                            <Typography className={classes.title} gutterBottom>
                                Total Orders
                            </Typography>
                            <Typography variant="h6" component="h2">
                                {orders.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Link to={'/superAdmin/tl/orders'}>
                                <Button size="small" color={'primary'}>
                                    View Orders
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Overview;
