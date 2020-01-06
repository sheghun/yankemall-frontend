import React, {useCallback, useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import clx from 'classnames';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import ListIcon from '@material-ui/icons/List';
import CancelIcon from '@material-ui/icons/Cancel';

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
    floatingButton: {
        position: 'fixed',
        bottom: '2rem',
        right: '.8rem',
        zIndex: 1000000000,
        '& .MuiAvatar-root': {
            background: theme.palette.secondary.main,
        },
    },
    addPaperWidth: {
        width: '250px !important',
    },
    [theme.breakpoints.down('sm')]: {
        paper: {
            width: '0',
            transition: 'all 1s ease-in-out',
        },
    },
}));

type props = RouteComponentProps & {
    links: Array<{
        path: string;
        text: string;
        icon?: any;
    }>;
};

const Sidebar = ({location, links}: props) => {
    const classes = useStyles();

    const [link, setLink] = useState('');
    const [showMobile, setShowMobile] = useState(false);

    useEffect(() => {
        setLink(location.pathname);
    }, [location.pathname]);

    const applyCssClass = useCallback(
        (path: string) => {
            return clx({[classes.link]: true, [classes.active]: !!location.pathname.match(path)});
        },
        [location, classes.link, classes.active],
    );

    return (
        <>
            <Paper className={classes.paper}>
                <Hidden smDown={true} implementation="css">
                    <Grid direction={'column'} alignContent={'center'} container={true} spacing={3}>
                        {links.map((l, i) => (
                            <React.Fragment key={i}>
                                {i === 3 && <Divider />}
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
                </Hidden>
            </Paper>
            <Hidden mdUp={true} implementation="css">
                <div className={classes.floatingButton}>
                    <Paper
                        className={clx({
                            [classes.paper]: true,
                            [classes.addPaperWidth]: showMobile,
                        })}
                    >
                        <Grid
                            direction={'column'}
                            alignContent={'center'}
                            container={true}
                            spacing={3}
                        >
                            {links.map((l, i) => (
                                <React.Fragment key={i}>
                                    {i === 3 && <Divider />}
                                    <Grid item={true} className={applyCssClass(l.path)}>
                                        <NavLink to={l.path}>
                                            <Typography
                                                className={classes.linkText}
                                                variant={'body1'}
                                            >
                                                {l.icon && <span>{l.icon}</span>}
                                                <span>{l.text}</span>
                                            </Typography>
                                        </NavLink>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Paper>
                    <Avatar onClick={() => setShowMobile(!showMobile)}>
                        {showMobile ? <CancelIcon /> : <ListIcon />}
                    </Avatar>
                </div>
            </Hidden>
        </>
    );
};

export default withRouter(Sidebar);
