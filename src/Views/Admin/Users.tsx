import React, {useContext, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles, useTheme} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {AdminContext} from '../../Context';
import {Link, Route, RouteComponentProps} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Snack from '../../components/snack';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Axios from 'axios';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment, {Moment} from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        paddingLeft: '2rem',
        paddingRight: '2rem',
        height: '100%',
        paddingBottom: '2rem',
    },
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    card: {
        width: '100%',
        border: 'solid 1px #EDEDED',
    },
    inputs: {
        marginBottom: '1rem',
    },
    orders: {
        border: '1px solid #ededed',
        marginBottom: '1rem',
        borderRadius: '1.5%',
    },
    table: {
        minWidth: 650,
        '& td': {
            fontSize: '14px !important',
        },
        '& tr': {
            cursor: 'pointer',
        },
    },
    pageTitle: {
        marginBottom: '3rem',
    },
}));
const Users = () => {
    const classes = useStyles();

    return (
        <>
            <Paper className={classes.paper}>
                <Route
                    path={'/superAdmin/tl/users'}
                    exact
                    render={props => <ViewUsers {...props} classes={classes} />}
                />
                <Route
                    path={'/superAdmin/tl/users/detail/:userId'}
                    exact
                    render={props => <UsersDetails {...props} classes={classes} />}
                />
            </Paper>
        </>
    );
};

export default Users;

const ViewUsers = ({history, classes}: RouteComponentProps & {classes: any}) => {
    const {users} = useContext(AdminContext);

    const [rows, setRows] = useState([] as Array<User>);

    useEffect(() => {
        setRows(users);
    }, [users]);

    return (
        <>
            <Typography variant={'h5'} className={classes.pageTitle}>
                Users
            </Typography>
            <div style={{paddingLeft: '-2rem', paddingRight: '-2rem'}}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Phone Number</TableCell>
                            <TableCell align="left">Orders</TableCell>
                            <TableCell align="left">Gender</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((user: User) => (
                            <TableRow
                                key={user.id}
                                hover
                                onClick={() =>
                                    history.push(`/superAdmin/tl/users/detail/${user.id}`)
                                }
                            >
                                <TableCell scope="row">
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell align="left">{user.email}</TableCell>
                                <TableCell align="left">{user.phoneNumber}</TableCell>
                                <TableCell align="center">{user.orders.length}</TableCell>
                                <TableCell align="left">{user.gender}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

const UsersDetails = ({match, classes}: RouteComponentProps & {classes: any}) => {
    const {users, setAdminObject} = useContext(AdminContext);
    const theme = useTheme();
    const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const [user, setUser] = useState({} as User);
    const [editDetails, setEditDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        variant: 'success',
    });

    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [orders, setOrders] = useState([] as Array<Order>);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState();
    const [birthDate, setBirthDate] = useState('YYY-MM-DD');
    const [addresses, setAddresses] = useState('');
    const [address, setAddress] = useState([] as Array<Address>);
    const [adFirstName, setAdFirstName] = useState('');
    const [adLastName, setAdLastName] = useState('');
    const [adPhoneNumber, setAdPhoneNumber] = useState('');
    const [adPostCode, setPostCode] = useState('');
    const [adState, adSetState] = useState('');
    const [adRegion, adSetRegion] = useState('');

    useEffect(() => {
        const {userId} = match.params as any;
        console.log(userId);
        if (userId) {
            const u = users.find(user => Number(user.id) === Number(userId));
            if (u) {
                setId(userId);
                setUser(u);
                setAddress(u.address);
                setFirstName(u.firstName);
                setLastName(u.lastName);
                setPhoneNumber(u.phoneNumber);
                setOrders(u.orders);
                setEmail(u.email);
                setGender(u.gender.toLowerCase());
                setBirthDate(u.birthDate);
            }
        }
    }, [users]);

    const updateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Check if the edit details flag has not been set
        if (!editDetails) {
            return;
        }
        setLoading(true);
        try {
            const d = {
                id,
                email,
                firstName,
                lastName,
                phoneNumber,
                gender,
                birthDate,
            };
            const {status, data} = await Axios.put('/admin/user', d);
            if (status === 200 && data.status === 'success') {
                setSnackbar({
                    open: true,
                    variant: 'success',
                    message: 'User details updated successfully',
                });
            }
            const usersArray = users.slice();
            const currentUser = usersArray.find(u => Number(u.id) === Number(id));
            if (!currentUser) return;
            const newUsersArray = usersArray.filter(u => Number(u.id) !== Number(id));
            // Add to the new Users Array
            newUsersArray.push({
                firstName,
                lastName,
                id,
                email,
                phoneNumber,
                address: currentUser.address,
                gender,
                payments: currentUser.payments,
                orders: currentUser.orders,
                birthDate: currentUser.birthDate,
            });
            setAdminObject(s => ({...s, users: newUsersArray}));
        } catch (e) {}
        setEditDetails(false);
        setLoading(false);
    };

    return (
        <>
            <Snack
                variant={snackbar.variant as any}
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar(s => ({...s, open: false}))}
            />
            <Typography align={'center'} variant={'h5'} className={classes.pageTitle}>
                {user.firstName} {user.lastName} Details
            </Typography>
            <Grid container justify={'center'}>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    component={editDetails ? 'form' : 'div'}
                    onSubmit={updateDetails}
                >
                    <Typography align={'center'}>
                        {editDetails ? (
                            <>
                                <TextField
                                    fullWidth
                                    label={'First name'}
                                    value={firstName}
                                    name={'first-name'}
                                    onChange={e => setFirstName(e.target.value)}
                                    id={'first-name'}
                                    required
                                    style={{marginBottom: '2rem'}}
                                />
                                <TextField
                                    fullWidth
                                    label={'Last name'}
                                    value={lastName}
                                    name={'last-name'}
                                    onChange={e => setLastName(e.target.value)}
                                    id={'last-name'}
                                    required
                                    style={{marginBottom: '2rem'}}
                                />
                            </>
                        ) : (
                            <>
                                Name:
                                <strong>
                                    {user.firstName} {user.lastName}
                                </strong>
                            </>
                        )}
                        <br />
                        {editDetails ? (
                            <TextField
                                fullWidth
                                label={'Phone Number'}
                                value={phoneNumber}
                                name={'phone-number'}
                                onChange={e => setPhoneNumber(e.target.value)}
                                id={'phone-number'}
                                required
                                style={{marginBottom: '2rem'}}
                            />
                        ) : (
                            <>
                                Phone Number:
                                <strong>{user.phoneNumber}</strong>
                            </>
                        )}
                        <br />
                        {editDetails ? (
                            <TextField
                                fullWidth
                                label={'email'}
                                value={email}
                                name={'email'}
                                onChange={e => setEmail(e.target.value)}
                                id={'email'}
                                required
                                style={{marginBottom: '2rem'}}
                            />
                        ) : (
                            <>
                                Email:
                                <strong>
                                    <strong>{user.email}</strong>
                                </strong>
                            </>
                        )}
                        <br />
                        {editDetails ? (
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    style={{width: '100%'}}
                                    margin="normal"
                                    variant={bigScreen ? 'inline' : 'dialog'}
                                    id="birthDate-picker-dialog"
                                    label="Birthday"
                                    onFocus={e => e.target.blur()}
                                    required
                                    format="YYYY-MM-DD"
                                    value={birthDate}
                                    onChange={birthDate =>
                                        setBirthDate((birthDate as Moment).format('YYYY-MM-DD'))
                                    }
                                    KeyboardButtonProps={{
                                        'aria-label': 'change birthDate',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        ) : (
                            <>
                                Birth Date:
                                <strong>{moment(user.birthDate).format('lll')}</strong>
                            </>
                        )}
                        <br />
                        {editDetails ? (
                            <TextField
                                fullWidth
                                label={'gender'}
                                value={gender}
                                name={'gender'}
                                onChange={e => setGender(e.target.value)}
                                id={'gender'}
                                required
                                style={{marginBottom: '2rem'}}
                                select
                            >
                                <MenuItem value={'male'}>Male</MenuItem>
                                <MenuItem value={'female'}>Female</MenuItem>
                            </TextField>
                        ) : (
                            <>
                                Gender:
                                <strong>
                                    <strong>{user.gender}</strong>
                                </strong>
                            </>
                        )}
                        <br />
                    </Typography>
                    {editDetails ? (
                        <Button fullWidth type={'submit'} disabled={loading} color={'primary'}>
                            {loading ? <CircularProgress /> : 'Save'}
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            type={'button'}
                            onClick={() => setEditDetails(true)}
                            color={'primary'}
                        >
                            Edit Details
                        </Button>
                    )}
                </Grid>
            </Grid>
            <Typography variant={'h5'} style={{margin: '2rem 0'}} align={'center'}>
                Addresses
            </Typography>
            <Grid container justify={'space-evenly'}>
                {address.map((ad, i) => (
                    <Grid key={i} item xs={12} md={5}>
                        <Card raised={false} elevation={0} className={classes.card}>
                            <CardContent>
                                <Typography className={classes.pos} style={{fontSize: '12px'}}>
                                    {address.length === 0 ? (
                                        'User have not added an address yet'
                                    ) : (
                                        <>
                                            {ad.firstName} {ad.lastName}
                                            <br />
                                            {ad.address}
                                            <br />
                                            {'+' + ad.phoneNumber}
                                            <br />
                                            {ad.zipCode}
                                        </>
                                    )}
                                </Typography>

                                {ad.default && (
                                    <Typography
                                        variant="body1"
                                        color={'primary'}
                                        style={{fontWeight: 500}}
                                    >
                                        Default address
                                    </Typography>
                                )}
                            </CardContent>
                            <CardActions style={{borderTop: 'solid 1px #ededed'}}>
                                <Typography className={classes.title}>
                                    <Link to={`/dashboard/address/edit?id=${ad.id}`}>
                                        <Button color={'primary'}>Edit Address</Button>
                                    </Link>
                                    <Link
                                        to={`/dashboard/address/edit?id=${ad.id}`}
                                        className={classes.icon}
                                    >
                                        <IconButton
                                            color={'primary'}
                                            aria-label={'Edit your address'}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                </Typography>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography variant={'h5'} style={{margin: '2rem 0'}} align={'center'}>
                Orders ({user.orders ? user.orders.length : '0'})
            </Typography>
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12} className={classes.orders}>
                    {user.orders &&
                        user.orders.map(or => (
                            <Grid style={{marginTop: '2rem'}} container justify={'center'}>
                                <Grid item xs={4} sm={3}>
                                    {or.products.map(p => (
                                        <img height={'80px'} alt={'Order Product'} src={p.image} />
                                    ))}
                                </Grid>
                                <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                                    <Typography variant={'h6'}>
                                        Items {or.products.length}
                                    </Typography>
                                    <br />
                                    <Typography variant={'body2'}>
                                        {or.products.map(p => (
                                            <>{p.name},</>
                                        ))}
                                    </Typography>
                                    <br />
                                    <Typography variant={'body2'}>
                                        User: {user.firstName} {user.lastName}{' '}
                                    </Typography>
                                    <br />
                                    <Typography variant={'caption'}>
                                        {moment(or.createdAt).format('lll')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                                    <Link to={'/superAdmin/tl/orders/detail/123'}>
                                        <Button color={'primary'}>See details</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        </>
    );
};
