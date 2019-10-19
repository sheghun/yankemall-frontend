import React, {useCallback} from 'react';
import Paper from '@material-ui/core/Paper';
import clx from 'classnames';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/PersonOutline';
import OrderIcon from '@material-ui/icons/AllInbox';
import Divider from '@material-ui/core/Divider';

const links = [
    {
        path: '/dashboard/overview',
        text: 'My Account',
        icon: <PersonIcon style={{marginRight: '1rem'}} />,
    },
    {
        path: '/dashboard/orders',
        text: 'Orders',
        icon: <OrderIcon style={{marginRight: '1rem'}} />,
    },
    {path: '/dashboard/details', text: 'Details'},
    {path: '/dashboard/changepass', text: 'Change Password'},
    {path: '/dashboard/address', text: 'Address'},
];

const useStyles = makeStyles(theme => ({
    active: {
        backgroundColor: '#EDEDED',
        '& p': {
            color: `${theme.palette.primary.main} !important`,
        },
    },
    paper: {
        overflow: 'hidden',
        padding: '2rem 0',
    },
    link: {
        width: '100%',
        padding: '1rem 0rem 1rem 2rem !important',
        color: '#282828',
        '& a': {
            textDecoration: 'none !important',
        },
    },
    linkText: {
        display: 'flex',
        fontWeight: 500,
        justifyContent: 'flex-start',
    },
}));

type props = RouteComponentProps & {};

const Sidebar = ({location}: props) => {
    const classes = useStyles();

    const applyCssClass = useCallback(
        (path: string) => {
            return clx({[classes.link]: true, [classes.active]: !!location.pathname.match(path)});
        },
        [location],
    );

    return (
        <Paper className={classes.paper}>
            <Grid direction={'column'} alignContent={'center'} container={true} spacing={3}>
                {links.map((l, i) => (
                    <React.Fragment key={i}>
                        {i === 2 && <Divider />}
                        <Grid item={true} className={applyCssClass(l.path)}>
                            <NavLink to={l.path}>
                                <Typography className={classes.linkText} variant={'body1'}>
                                    {l.icon && <span>{l.icon}</span>}
                                    <span>{l.text}</span>
                                </Typography>
                            </NavLink>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Paper>
    );
};

export default withRouter(Sidebar);
