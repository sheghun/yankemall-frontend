import React, {useCallback, useEffect, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import clx from 'classnames';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import BottomNavigation from '@material-ui/core/BottomNavigation/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Hidden from '@material-ui/core/Hidden';

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
    bottomNavigation: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        zIndex: 10000,
        left: 0,
    },
    bottomNavigationLabels: {
        fontSize: '14px !important',
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

    useEffect(() => {
        setLink(location.pathname);
    }, []);

    const applyCssClass = useCallback(
        (path: string) => {
            return clx({[classes.link]: true, [classes.active]: !!location.pathname.match(path)});
        },
        [location],
    );

    return (
        <Paper className={classes.paper}>
            <Hidden smDown={true} implementation="css">
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
            </Hidden>
            <Hidden mdUp={true} implementation="css">
                <Paper elevation={4}>
                    <BottomNavigation
                        value={link}
                        component={Paper}
                        onChange={(e, value) => setLink(value)}
                        classes={{root: classes.bottomNavigation}}
                    >
                        {links.map((l, i) => (
                            <BottomNavigationAction
                                key={i}
                                style={{
                                    fontSize: '14px !important',
                                    marginLeft: '-0.5rem',
                                    marginRight: '-0.5rem',
                                }}
                                to={l.path}
                                component={Link}
                                classes={{label: classes.bottomNavigationLabels}}
                                label={l.text.includes(' ') ? l.text.split(' ')[1] : l.text}
                                showLabel={true}
                                value={l.path}
                                icon={l.icon}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            </Hidden>
        </Paper>
    );
};

export default withRouter(Sidebar);
