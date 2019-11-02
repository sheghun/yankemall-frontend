import React, {useContext, useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core';
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
    const {users} = useContext(AdminContext);

    const [user, setUser] = useState({} as User);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [orders, setOrders] = useState([] as Array<Order>);
    const [phoneNumber, setPhoneNumber] = useState('');
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
                setUser(u);
                setAddress(u.address);
            }
        }
    }, [users]);

    return (
        <>
            <Typography align={'center'} variant={'h5'} className={classes.pageTitle}>
                {user.firstName} {user.lastName} Details
            </Typography>
            <Grid container justify={'center'}>
                <Grid item xs={12} sm={6}>
                    <Typography align={'center'}>
                        Name:
                        <strong>
                            {user.firstName} {user.lastName}
                        </strong>
                        <br />
                        Phone Number: <strong>{user.phoneNumber}</strong>
                        <br />
                        E-mail: <strong>{user.email}</strong>
                        <br />
                        Gender: <strong>{user.gender}</strong>
                        <br />
                    </Typography>
                    <Button fullWidth color={'primary'}>
                        Edit Details
                    </Button>
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
                Orders (0)
            </Typography>
            <Grid container justify={'center'} spacing={3}>
                <Grid item xs={12} className={classes.orders}>
                    <Grid container justify={'center'}>
                        <Grid item xs={4} sm={3}>
                            <img
                                height={'80px'}
                                alt={'Order Product'}
                                src={
                                    'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                }
                            />
                            <img
                                height={'80px'}
                                alt={'Order Product'}
                                src={
                                    'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                }
                            />
                            <img
                                height={'80px'}
                                alt={'Order Product'}
                                src={
                                    'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                }
                            />
                            <img
                                height={'80px'}
                                alt={'Order Product'}
                                src={
                                    'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                }
                            />
                            <img
                                height={'80px'}
                                alt={'Order Product'}
                                src={
                                    'https://ng.jumia.is/unsafe/fit-in/150x150/filters:fill(white)/product/99/098663/1.jpg?1043'
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                            <Typography variant={'h6'}>Items (10)</Typography>
                            <br />
                            <Typography variant={'body2'}>
                                Cleansing Detox Foot Pads, iPhone 6s, Tecno Camon X, iPhone 7...
                            </Typography>
                            <br />
                            <Typography variant={'body2'}>User: Oladiran Segun</Typography>
                            <br />
                            <Typography variant={'caption'}>Placed ON 02-09-2019</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
                            <Link to={'/superAdmin/tl/orders/detail/123'}>
                                <Button color={'primary'}>See details</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};
